package com.ce192012.assignment3.repository;

import com.ce192012.assignment3.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    Optional<RoomType> findByRoomTypeName(String roomTypeName);
}

