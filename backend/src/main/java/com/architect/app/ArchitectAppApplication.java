package com.architect.app;

import com.architect.app.model.Architect;
import com.architect.app.repository.ArchitectRepository;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class ArchitectAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArchitectAppApplication.class, args);
	}

	// WebClient with long OpenAI-safe timeouts
	@Bean
	public WebClient.Builder webClientBuilder() {
		HttpClient httpClient = HttpClient.create()
				.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)
				.responseTimeout(Duration.ofMinutes(5))
				.doOnConnected(conn -> conn
						.addHandlerLast(new ReadTimeoutHandler(300, TimeUnit.SECONDS))
						.addHandlerLast(new WriteTimeoutHandler(300, TimeUnit.SECONDS)));

		return WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient));
	}

	// 🔥 FINAL CORS LOCK (frontend on 5173)
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "OPTIONS")
						.allowedHeaders("*");
			}
		};
	}

	// Demo architects auto seed
	@Bean
	public CommandLineRunner demo(ArchitectRepository repository) {
		return (args) -> {
			if (repository.count() == 0) {

				Architect a1 = new Architect();
				a1.setName("Ar. Rajesh Kumar");
				a1.setSpecialty("Sustainable Modern Homes");
				a1.setContact("98765 43210");
				a1.setRating("4.9/5");
				a1.setPriceRange("₹150 - ₹250 per sq.ft");
				a1.setBio("Over 15 years of experience in green building designs.");
				repository.save(a1);

				Architect a2 = new Architect();
				a2.setName("Urban Studio Designs");
				a2.setSpecialty("Luxury Villas & Interiors");
				a2.setContact("99887 76655");
				a2.setRating("4.7/5");
				a2.setPriceRange("₹200 - ₹500 per sq.ft");
				a2.setBio("Award-winning firm specializing in high-end luxury residences.");
				repository.save(a2);

				Architect a3 = new Architect();
				a3.setName("Budget Homes Consultants");
				a3.setSpecialty("Cost-Effective Housing");
				a3.setContact("88776 65544");
				a3.setRating("4.5/5");
				a3.setPriceRange("₹50 - ₹100 per sq.ft");
				a3.setBio("Helping families build their dream home within strict budgets.");
				repository.save(a3);
			}
		};
	}
}
