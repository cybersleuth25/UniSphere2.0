# UniSphere

> **Stay Updated. Stay Connected.**

UniSphere is a modern, student-centric hub designed to streamline campus communication. It serves as a centralized platform for university announcements, upcoming events, resource sharing, and community engagement. 

Originally conceived as a procedural PHP application, UniSphere has been meticulously rebuilt into a robust **Grails 6 MVC** architecture with a highly bespoke, engaging frontend.

## 🌟 Key Features

*   **Elevated Neo-Brutalist UI/UX:** A bespoke, high-contrast design system featuring bold geometric borders, hard offset shadows, academic dot-matrix backgrounds, and aggressive typography (Syne & Outfit).
*   **Dynamic CSS Motion:** Smooth, staggered DOM entry animations and layout transitions handled entirely via CSS without heavy JavaScript libraries.
*   **Role-Based Access Control (RBAC):**
    *   **Admins** (Student Council/Faculty): Exclusive permissions to post critical campus Announcements and Events.
    *   **Students**: Can actively participate by posting in Lost & Found, studying Resources, Courses, and Community Connect groups.
*   **Rich Interactive Feeds:** Interactive posts supporting rich text via Markdown, image attachments, a liking system, and expandable text components.
*   **Secure Authentication & Profiles:** Robust signup/login flows with dynamic user profiles, avatar seeding, and account management.
*   **Fluid Dark/Light Mode:** First-class support for both high-contrast Light mode and deep Dark mode, utilizing real-time CSS variable swapping via user toggles.

## 🛠️ Technology Stack

**Backend**
*   [Grails 6](https://grails.org/) (Groovy & Spring Boot MVC)
*   **GORM** (Grails Object Relational Mapping)
*   **H2 Database** (Configured in MySQL Compatibility Mode for seamless local development)

**Frontend**
*   **GSP** (Groovy Server Pages) for rapid server-side layout rendering
*   **Vanilla JavaScript (ES6)** (Fetch API, DOM manipulation)
*   **CSS3** (Bespoke tokens, CSS Variables, Flexbox/Grid, Keyframe Animations)
*   [Marked.js](https://marked.js.org/) for Markdown rendering

## 🚀 Local Development Setup

To run the UniSphere application locally for development or demonstration:

### Prerequisites
*   **Java Development Kit (JDK):** Version 11 or 17 is recommended.

### Installation & Launch
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/UniSphere.git
    cd UniSphere/grails-app
    ```

2.  **Start the Grails Application:**
    Utilize the Gradle wrapper to automatically fetch dependencies and boot the application up.
    ```bash
    # On Windows:
    .\gradlew.bat bootRun

    # On macOS/Linux:
    ./gradlew bootRun
    ```

3.  **Access the Application:**
    Once the Spring Boot sequence completes successfully, navigate to:
    ```
    http://localhost:8080
    ```

### Seeded Data
Upon initialization, the application's `BootStrap.groovy` script provisions the embedded database with an initial Admin user account, allowing immediate testing of administrative features (like posting Events and Announcements) without manual database intervention.

## 👤 Author 
Developed as an internship capstone project.
