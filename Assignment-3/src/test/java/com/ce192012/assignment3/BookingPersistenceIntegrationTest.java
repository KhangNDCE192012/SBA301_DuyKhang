package com.ce192012.assignment3;

import com.ce192012.assignment3.dto.booking.BookingItemRequest;
import com.ce192012.assignment3.dto.booking.BookingReservationDto;
import com.ce192012.assignment3.dto.booking.CreateBookingRequest;
import com.ce192012.assignment3.entity.BookingDetail;
import com.ce192012.assignment3.entity.BookingReservation;
import com.ce192012.assignment3.entity.Customer;
import com.ce192012.assignment3.entity.RoomInformation;
import com.ce192012.assignment3.repository.BookingDetailRepository;
import com.ce192012.assignment3.repository.BookingReservationRepository;
import com.ce192012.assignment3.repository.CustomerRepository;
import com.ce192012.assignment3.repository.RoomInformationRepository;
import com.ce192012.assignment3.service.BookingService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BookingPersistenceIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private BookingReservationRepository reservationRepository;

    @Autowired
    private BookingDetailRepository detailRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    void createBooking_persistsOneReservationWithMultipleRoomDetails() {
        Customer customer = customerRepository.findAll().stream()
                .filter(c -> c.getCustomerStatus() != null && c.getCustomerStatus() == 1)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("The test database needs an active sample customer."));

        List<RoomInformation> activeRooms = roomRepository.findByRoomStatus((byte) 1);
        assertTrue(activeRooms.size() >= 2, "The test database needs at least two active sample rooms.");

        // A far-future date keeps this integration test independent from demo bookings.
        LocalDate startDate = LocalDate.of(2098, 8, 10);
        LocalDate endDate = LocalDate.of(2098, 8, 15);

        CreateBookingRequest request = new CreateBookingRequest(customer.getCustomerId(), List.of(
                new BookingItemRequest(activeRooms.get(0).getRoomId(), startDate, endDate),
                new BookingItemRequest(activeRooms.get(1).getRoomId(), startDate, endDate)
        ));

        BookingReservationDto result = bookingService.createBooking(customer.getCustomerId(), request);

        assertNotNull(result.getBookingReservationId());
        assertEquals(2, result.getBookingDetails().size());

        entityManager.flush();
        entityManager.clear();

        BookingReservation saved = reservationRepository.findById(result.getBookingReservationId())
                .orElseThrow(() -> new AssertionError("Reservation was not saved."));
        List<BookingDetail> details = detailRepository
                .findByBookingReservation_BookingReservationId(result.getBookingReservationId());

        assertEquals((byte) 1, saved.getBookingStatus());
        assertEquals(2, details.size());
        assertTrue(details.stream().allMatch(detail -> detail.getActualPrice() != null));
        assertTrue(details.stream().allMatch(detail -> startDate.equals(detail.getStartDate())
                && endDate.equals(detail.getEndDate())));
    }

    @Test
    void customerHistory_canBeReadAfterTheServiceTransactionHasClosed() {
        Customer customer = customerRepository.findAll().stream()
                .filter(c -> c.getCustomerStatus() != null && c.getCustomerStatus() == 1)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("The test database needs an active sample customer."));

        List<BookingReservationDto> history = bookingService.getCustomerBookings(customer.getCustomerId());

        assertNotNull(history);
        for (BookingReservationDto reservation : history) {
            assertNotNull(reservation.getBookingReservationId());
            assertNotNull(reservation.getBookingDetails());
        }
    }
}
