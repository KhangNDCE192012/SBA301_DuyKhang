package com.ce192012.assignment3.service;

import com.ce192012.assignment3.dto.booking.*;
import com.ce192012.assignment3.entity.BookingDetail;
import com.ce192012.assignment3.entity.BookingDetailId;
import com.ce192012.assignment3.entity.BookingReservation;
import com.ce192012.assignment3.entity.Customer;
import com.ce192012.assignment3.entity.RoomInformation;
import com.ce192012.assignment3.exception.BadRequestException;
import com.ce192012.assignment3.exception.ResourceNotFoundException;
import com.ce192012.assignment3.exception.UnauthorizedException;
import com.ce192012.assignment3.repository.BookingDetailRepository;
import com.ce192012.assignment3.repository.BookingReservationRepository;
import com.ce192012.assignment3.repository.CustomerRepository;
import com.ce192012.assignment3.repository.RoomInformationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingReservationRepository reservationRepository;
    private final BookingDetailRepository detailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public BookingService(BookingReservationRepository reservationRepository,
                          BookingDetailRepository detailRepository,
                          CustomerRepository customerRepository,
                          RoomInformationRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.detailRepository = detailRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public BookingReservationDto createBooking(Integer customerId, CreateBookingRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("At least one room must be included in the booking reservation.");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new BadRequestException("Customer account is inactive. Cannot create booking reservation.");
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setCustomer(customer);
        reservation.setBookingDate(LocalDate.now());
        reservation.setBookingStatus((byte) 1); // 1 = Confirmed / Active

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();
        Set<Integer> selectedRoomIds = new HashSet<>();

        for (BookingItemRequest item : request.getItems()) {
            if (item.getRoomId() == null) {
                throw new BadRequestException("Room ID is required for each booking detail.");
            }
            if (!selectedRoomIds.add(item.getRoomId())) {
                throw new BadRequestException("A room can only appear once in one booking reservation.");
            }
            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new BadRequestException("Start date and end date are required for each room.");
            }
            if (!item.getEndDate().isAfter(item.getStartDate())) {
                throw new BadRequestException("End date must be after start date for room ID: " + item.getRoomId());
            }

            RoomInformation room = roomRepository.findById(item.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.getRoomId()));

            if (room.getRoomStatus() == null || room.getRoomStatus() != 1) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive.");
            }

            // Check for overlapping active reservations in database (status 1 = Confirmed / Active)
            boolean isOverlapping = detailRepository.hasOverlappingBooking(
                    room.getRoomId(),
                    item.getStartDate(),
                    item.getEndDate(),
                    (byte) 1
            );
            if (isOverlapping) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is already booked for the selected dates ("
                        + item.getStartDate() + " to " + item.getEndDate() + ").");
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());

            BigDecimal roomPrice = room.getRoomPricePerDay() != null ? room.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal itemTotal = roomPrice.multiply(BigDecimal.valueOf(days));
            calculatedTotal = calculatedTotal.add(itemTotal);

            BookingDetail detail = new BookingDetail();
            detail.setRoomInformation(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(itemTotal);

            details.add(detail);
        }

        reservation.setTotalPrice(calculatedTotal);
        BookingReservation savedReservation = reservationRepository.save(reservation);

        for (BookingDetail detail : details) {
            detail.setId(new BookingDetailId(
                    savedReservation.getBookingReservationId(),
                    detail.getRoomInformation().getRoomId()
            ));
            savedReservation.addBookingDetail(detail);
        }

        return toDto(savedReservation);
    }

    /**
     * Staff can update the customer and room details of an existing reservation.
     * The old details are replaced inside one transaction.
     */
    @Transactional
    public BookingReservationDto updateBooking(Integer bookingId, CreateBookingRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("At least one room must be included in the booking reservation.");
        }

        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking reservation not found with ID: " + bookingId));

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Customer not found with ID: " + request.getCustomerId()));
            if (customer.getCustomerStatus() == null || customer.getCustomerStatus() != 1) {
                throw new BadRequestException("Cannot assign a booking to an inactive customer.");
            }
            reservation.setCustomer(customer);
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        Set<Integer> selectedRoomIds = new HashSet<>();
        List<BookingDetail> oldDetails = new ArrayList<>(reservation.getBookingDetails());

        for (BookingItemRequest item : request.getItems()) {
            if (item.getRoomId() == null || !selectedRoomIds.add(item.getRoomId())) {
                throw new BadRequestException("Each room must have a valid, unique room ID.");
            }
            if (item.getStartDate() == null || item.getEndDate() == null
                    || !item.getEndDate().isAfter(item.getStartDate())) {
                throw new BadRequestException("Each room must have a valid date range (end date after start date).");
            }

            RoomInformation room = roomRepository.findById(item.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Room not found with ID: " + item.getRoomId()));
            if (room.getRoomStatus() == null || room.getRoomStatus() != 1) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive.");
            }

            boolean overlapping = detailRepository.hasOverlappingBookingExcept(
                    room.getRoomId(), item.getStartDate(), item.getEndDate(), (byte) 1, bookingId);
            if (overlapping) {
                throw new BadRequestException("Room " + room.getRoomNumber()
                        + " is already booked for the selected dates.");
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            BigDecimal roomPrice = room.getRoomPricePerDay() == null
                    ? BigDecimal.ZERO : room.getRoomPricePerDay();
            BigDecimal itemTotal = roomPrice.multiply(BigDecimal.valueOf(days));
            totalPrice = totalPrice.add(itemTotal);

            BookingDetail detail = oldDetails.stream()
                    .filter(old -> old.getRoomInformation().getRoomId().equals(room.getRoomId()))
                    .findFirst()
                    .orElse(null);

            if (detail == null) {
                detail = new BookingDetail();
                detail.setRoomInformation(room);
                reservation.addBookingDetail(detail);
            }

            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(itemTotal);
        }

        // Remove details that Staff unchecked in the edit form.
        for (BookingDetail oldDetail : oldDetails) {
            Integer oldRoomId = oldDetail.getRoomInformation().getRoomId();
            if (!selectedRoomIds.contains(oldRoomId)) {
                reservation.removeBookingDetail(oldDetail);
            }
        }
        reservation.setTotalPrice(totalPrice);

        return toDto(reservationRepository.save(reservation));
    }

    @Transactional(readOnly = true)
    public List<BookingReservationDto> getCustomerBookings(Integer customerId) {
        return reservationRepository.findByCustomerIdOrderByBookingDateDesc(customerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingReservationDto getCustomerBookingById(Integer customerId, Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        // Enforce ownership: customer can only view their own booking
        if (!reservation.getCustomer().getCustomerId().equals(customerId)) {
            throw new UnauthorizedException("Access denied: You can only view your own booking reservations.");
        }

        return toDto(reservation);
    }

    // Staff: view all bookings
    @Transactional(readOnly = true)
    public List<BookingReservationDto> getAllBookingsForStaff() {
        return reservationRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Staff: view single booking
    @Transactional(readOnly = true)
    public BookingReservationDto getBookingByIdForStaff(Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));
        return toDto(reservation);
    }

    @Transactional
    public BookingReservationDto updateBookingStatus(Integer bookingId, Byte status) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        if (status == null || (status != 0 && status != 1 && status != 2)) {
            throw new BadRequestException("Booking status must be 0 (Cancelled), 1 (Confirmed), or 2 (Completed).");
        }

        reservation.setBookingStatus(status);
        BookingReservation saved = reservationRepository.save(reservation);
        return toDto(saved);
    }

    @Transactional
    public void deleteBooking(Integer bookingId) {
        BookingReservation reservation = reservationRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + bookingId));

        reservationRepository.delete(reservation);
    }

    public BookingReservationDto toDto(BookingReservation res) {
        List<BookingDetailDto> detailDtos = res.getBookingDetails().stream()
                .map(d -> new BookingDetailDto(
                        d.getRoomInformation() != null ? d.getRoomInformation().getRoomId() : null,
                        d.getRoomInformation() != null ? d.getRoomInformation().getRoomNumber() : "",
                        (d.getRoomInformation() != null && d.getRoomInformation().getRoomType() != null)
                                ? d.getRoomInformation().getRoomType().getRoomTypeName() : "",
                        d.getStartDate(),
                        d.getEndDate(),
                        d.getActualPrice()
                ))
                .collect(Collectors.toList());

        return new BookingReservationDto(
                res.getBookingReservationId(),
                res.getBookingDate(),
                res.getTotalPrice(),
                res.getCustomer() != null ? res.getCustomer().getCustomerId() : null,
                res.getCustomer() != null ? res.getCustomer().getCustomerFullName() : "",
                res.getCustomer() != null ? res.getCustomer().getEmailAddress() : "",
                res.getBookingStatus(),
                detailDtos
        );
    }
}

