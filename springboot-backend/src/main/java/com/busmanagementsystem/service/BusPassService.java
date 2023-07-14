package com.busmanagementsystem.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.busmanagementsystem.entity.BusPass;
import com.busmanagementsystem.repository.BusPassRepository;

@Service
public class BusPassService {
    private final BusPassRepository busPassRepository;

    @Autowired
    public BusPassService(BusPassRepository busPassRepository) {
        this.busPassRepository = busPassRepository;
    }

    public BusPass saveBusPass(BusPass busPass) {
        return busPassRepository.save(busPass);
    }

    public BusPass getBusPassById(Long id) {
        return busPassRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Bus pass not found"));
    }

    public BusPass updateBusPass(Long id, BusPass updatedBusPass) {
        BusPass busPass = getBusPassById(id);
        busPass.setPassenger(updatedBusPass.getPassenger());
        busPass.setPassType(updatedBusPass.getPassType());
        busPass.setValidityStart(updatedBusPass.getValidityStart());
        busPass.setValidityEnd(updatedBusPass.getValidityEnd());
        busPass.setActive(updatedBusPass.getActive());
        return busPassRepository.save(busPass);
    }

    public void deleteBusPass(Long id) {
        BusPass busPass = getBusPassById(id);
        busPassRepository.delete(busPass);
    }

    public List<BusPass> getAllBusPasses() {
        return busPassRepository.findAll();
    }
}
