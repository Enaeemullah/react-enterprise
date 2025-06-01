# Enterprise Dashboard

A comprehensive enterprise management system built with React, Spring Boot, and modern web technologies.

![Enterprise Dashboard](https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Multi-organization support

- 📦 **Inventory Management**
  - Real-time stock tracking
  - Barcode/QR code generation
  - Stock transfers between locations
  - Low stock alerts
  - Bulk import/export

- 👥 **Customer Management**
  - Customer profiles
  - Service history
  - Communication logs
  - Custom fields

- 💼 **Service Management**
  - Service catalog
  - Booking system
  - Service history
  - Pricing management

- 📊 **Analytics & Reporting**
  - Sales analytics
  - Inventory reports
  - Customer insights
  - Revenue tracking
  - Custom report generation

- 🌐 **Multi-language Support**
  - English
  - Spanish
  - Easy addition of new languages

- 🎨 **Theme Customization**
  - Light/Dark mode
  - Custom color schemes
  - Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Hook Form
- Zod
- i18next
- Socket.IO Client
- Chart.js
- Lucide Icons

### Backend
- Spring Boot 3.2
- Java 17
- MySQL
- JPA/Hibernate
- Spring Security
- JWT Authentication
- WebSocket (Socket.IO)
- Flyway Migration
- MapStruct
- Lombok

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8+
- Maven

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/enterprise-dashboard.git

# Navigate to project directory
cd enterprise-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_DUMMY_AUTH=false
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/enterprise_db
    username: your_username
    password: your_password
```

## Project Structure

### Frontend
```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/         # Page components
├── services/      # API service layers
├── lib/           # Utility functions
└── i18n/          # Internationalization files
```

### Backend
```
src/main/java/
├── config/        # Configuration classes
├── controller/    # REST controllers
├── dto/           # Data transfer objects
├── entity/        # JPA entities
├── repository/    # Data access layer
├── service/       # Business logic
└── security/      # Security configurations
```

## Key Features Implementation

### Real-time Updates
The system uses Socket.IO for real-time updates:
- Inventory changes
- Low stock alerts
- New orders
- Customer activities

### Security
- JWT-based authentication
- Role-based access control
- API endpoint protection
- CORS configuration
- Password encryption

### Data Management
- Efficient database queries
- Caching mechanisms
- Bulk operations support
- Data validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@enterprise-dashboard.com or join our Slack channel.

## Acknowledgments

- [React](https://reactjs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [TailwindCSS](https://tailwindcss.com/)
- [Socket.IO](https://socket.io/)
- [Chart.js](https://www.chartjs.org/)
- [Lucide Icons](https://lucide.dev/)