package fu.se.backend.controller;

import fu.se.backend.entity.Orchid;
import fu.se.backend.service.OrchidService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final OrchidService service;

    public OrchidController(OrchidService service) {
        this.service = service;
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Orchid>> getAll() {
        return ResponseEntity.ok(service.getAllOrchids());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getById(
            @PathVariable Integer id) {

        return service.getOrchidById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Orchid> create(
            @Valid @RequestBody Orchid orchid) {

        Orchid saved = service.createOrchid(orchid);

        return ResponseEntity.created(
                URI.create("/orchids/" + saved.getOrchidId())
        ).body(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Orchid> update(
            @PathVariable Integer id,
            @Valid @RequestBody Orchid orchid) {

        return service.updateOrchid(id, orchid)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id) {

        if (service.deleteOrchid(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
