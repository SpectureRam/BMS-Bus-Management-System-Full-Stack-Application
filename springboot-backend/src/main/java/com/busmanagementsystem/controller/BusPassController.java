package com.busmanagementsystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.busmanagementsystem.entity.BusPass;
import com.busmanagementsystem.service.BusPassService;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/buspass")
public class BusPassController {
    private final BusPassService busPassService;

    @Autowired
    public BusPassController(BusPassService busPassService) {
        this.busPassService = busPassService;
    }

    @PostMapping
    public ResponseEntity<BusPass> createBusPass(@RequestBody BusPass busPass) {
        BusPass createdBusPass = busPassService.saveBusPass(busPass);
        return ResponseEntity.ok(createdBusPass);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusPass> getBusPassById(@PathVariable Long id) {
        BusPass busPass = busPassService.getBusPassById(id);
        return ResponseEntity.ok(busPass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusPass> updateBusPass(@PathVariable Long id, @RequestBody BusPass updatedBusPass) {
        BusPass busPass = busPassService.updateBusPass(id, updatedBusPass);
        return ResponseEntity.ok(busPass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusPass(@PathVariable Long id) {
        busPassService.deleteBusPass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BusPass>> getAllBusPasses() {
        List<BusPass> busPasses = busPassService.getAllBusPasses();
        return ResponseEntity.ok(busPasses);
    }
}
