package com.ce192012.assignment3.service;

import com.ce192012.assignment3.dto.room.RoomTypeDto;
import com.ce192012.assignment3.entity.RoomType;
import com.ce192012.assignment3.exception.BadRequestException;
import com.ce192012.assignment3.exception.ResourceNotFoundException;
import com.ce192012.assignment3.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeService(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    public List<RoomTypeDto> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RoomTypeDto getRoomTypeById(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));
        return toDto(roomType);
    }

    @Transactional
    public RoomTypeDto createRoomType(RoomTypeDto dto) {
        RoomType roomType = new RoomType();
        roomType.setRoomTypeName(dto.getRoomTypeName());
        roomType.setTypeDescription(dto.getTypeDescription());
        roomType.setTypeNote(dto.getTypeNote());

        RoomType saved = roomTypeRepository.save(roomType);
        return toDto(saved);
    }

    @Transactional
    public RoomTypeDto updateRoomType(Integer id, RoomTypeDto dto) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));

        roomType.setRoomTypeName(dto.getRoomTypeName());
        roomType.setTypeDescription(dto.getTypeDescription());
        roomType.setTypeNote(dto.getTypeNote());

        RoomType saved = roomTypeRepository.save(roomType);
        return toDto(saved);
    }

    @Transactional
    public void deleteRoomType(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with ID: " + id));

        if (!roomType.getRooms().isEmpty()) {
            throw new BadRequestException("Cannot delete room type because it contains active rooms.");
        }

        roomTypeRepository.delete(roomType);
    }

    public RoomTypeDto toDto(RoomType rt) {
        return new RoomTypeDto(
                rt.getRoomTypeId(),
                rt.getRoomTypeName(),
                rt.getTypeDescription(),
                rt.getTypeNote()
        );
    }
}

