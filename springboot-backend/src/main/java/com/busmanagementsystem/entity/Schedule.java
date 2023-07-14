package com.busmanagementsystem.entity;
import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.busmanagementsystem.entity.Schedule;

	@Entity
	@Table(name = "schedule")
	public class Schedule {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "schedule_id")
	    private Long id;
	
	    @ManyToOne
	    @JoinColumn(name = "bus_id")
	    private Bus bus;
	
	    @ManyToOne
	    @JoinColumn(name = "route_id")
	    private Route route;
	
	    @ManyToOne
	    @JoinColumn(name = "driver_id")
	    private Driver driver;
	
	    @Column(name = "departure_time")
	    private LocalTime departureTime;
	
	    @Column(name = "arrival_time")
	    private LocalTime arrivalTime;

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Bus getBus() {
			return bus;
		}

		public void setBus(Bus bus) {
			this.bus = bus;
		}

		public Route getRoute() {
			return route;
		}

		public void setRoute(Route route) {
			this.route = route;
		}

		public Driver getDriver() {
			return driver;
		}

		public void setDriver(Driver driver) {
			this.driver = driver;
		}

		public LocalTime getDepartureTime() {
			return departureTime;
		}

		public void setDepartureTime(LocalTime departureTime) {
			this.departureTime = departureTime;
		}

		public LocalTime getArrivalTime() {
			return arrivalTime;
		}

		public void setArrivalTime(LocalTime arrivalTime) {
			this.arrivalTime = arrivalTime;
		}

		public Schedule(Long id, Bus bus, Route route, Driver driver, LocalTime departureTime, LocalTime arrivalTime) {
			super();
			this.id = id;
			this.bus = bus;
			this.route = route;
			this.driver = driver;
			this.departureTime = departureTime;
			this.arrivalTime = arrivalTime;
		}

		public Schedule() {
		}
	}