package fu.se.backend.repository;

import fu.se.backend.entity.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrchidRepository
        extends JpaRepository<Orchid, Integer> {
}