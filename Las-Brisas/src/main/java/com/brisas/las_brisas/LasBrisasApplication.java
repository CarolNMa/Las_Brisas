package com.brisas.las_brisas;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.model.user.user.status;
import com.brisas.las_brisas.repository.user.Irol;
import com.brisas.las_brisas.repository.user.Iuser;

@SpringBootApplication
public class LasBrisasApplication {

	public static void main(String[] args) {
		SpringApplication.run(LasBrisasApplication.class, args);
	}

	@Profile("!test")
	@Bean
	CommandLineRunner initDatabase(Irol rolRepo, Iuser userRepo, PasswordEncoder encoder) {
		return args -> {
			// Create ADMIN role if it doesn't exist
			if (rolRepo.findByName("ADMIN").isEmpty()) {
				rol adminRole = rol.builder()
					.name("ADMIN")
					.description("Administrator")
					.build();
				rolRepo.save(adminRole);
			}


			// Create default admin user if no users exist
			if (userRepo.count() == 0) {
				rol adminRole = rolRepo.findByName("ADMIN")
					.orElseThrow(() -> new RuntimeException("ADMIN role not found"));

				user adminUser = user.builder()
					.username("admin")
					.email("admin@lasbrisas.com")
					.password(encoder.encode("admin123"))
					.status(status.active)
					.createdAt(LocalDateTime.now())
					.roles(Set.of(adminRole))
					.build();

				userRepo.save(adminUser);
				System.out.println("Default admin user created:");
				System.out.println("Email: admin@lasbrisas.com");
				System.out.println("Password: admin123");
			}
		};
	}

}
