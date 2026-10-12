package fu.se.backend.service;


import fu.se.backend.entity.Orchid;
import fu.se.backend.repository.OrchidRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrchidService {

    private final OrchidRepository repository;

    public OrchidService(OrchidRepository repository) {
        this.repository = repository;
    }

    // GET ALL
    public List<Orchid> getAllOrchids() {
        return repository.findAll();
    }

    // GET BY ID
    public Optional<Orchid> getOrchidById(Integer id) {
        return repository.findById(id);
    }

    // CREATE
    public Orchid createOrchid(Orchid orchid) {
        orchid.setOrchidId(null);
        return repository.save(orchid);
    }

    // UPDATE
    public Optional<Orchid> updateOrchid(
            Integer id, Orchid input) {

        return repository.findById(id).map(existing -> {
            existing.setOrchidName(input.getOrchidName());
            existing.setNatural(input.isNatural());
            existing.setOrchidDescription(
                    input.getOrchidDescription());
            existing.setOrchidCategory(
                    input.getOrchidCategory());
            existing.setAttractive(input.isAttractive());
            existing.setOrchidURL(input.getOrchidURL());

            return repository.save(existing);
        });
    }

    // DELETE
    public boolean deleteOrchid(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}