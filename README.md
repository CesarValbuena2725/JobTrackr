# JobTrackr

## Project Description

**JobTrackr** is a lightweight web application designed to help users track their job applications efficiently. The project was planned, designed, and implemented out of a personal need for a better alternative to spreadsheets like Excel.

While spreadsheets are useful, JobTrackr goes a step further by allowing users to update their application records on the go, while also providing analytics and a faster, more structured way to manage application data.

JobTrackr is **free and always will be**. In today’s job market, it’s essential to keep track of when and why you applied for a role, the position title, company details, and application progress — JobTrackr makes that process simple and accessible.

The application was designed to be **lightweight, fast, user-friendly, and reliable**.  
Its UI and internal logic follow the **KISS (Keep It Simple, Stupid)** and **DRY (Don’t Repeat Yourself)** principles. The UX is intentionally straightforward, guiding users through the workflow without requiring a manual. Sensitive data is properly hashed and encrypted.

---

## Screenshots

### Login Screen

<img width="2559" height="1245" alt="Login Screen" src="https://github.com/user-attachments/assets/a68ea6cc-db12-4cb1-a70f-97456932a201" />

### Main Dashboard

<img width="2559" height="1246" alt="Main Dashboard" src="https://github.com/user-attachments/assets/7914ac9f-7ce0-46b5-ac17-f9b3563ef047" />

### New Application Form

<img width="832" height="1059" alt="New Application Form" src="https://github.com/user-attachments/assets/8c7b51a0-ee52-43d3-a532-4f720582f28b" />

### Delete Confirmation

<img width="1778" height="1085" alt="Delete Confirmation" src="https://github.com/user-attachments/assets/f5b2b84e-f705-498c-8271-61342e6759f9" />

### Update Application Form

<img width="842" height="1075" alt="Update Application Form" src="https://github.com/user-attachments/assets/e49467a2-671d-4a7e-9418-ecae683681b5" />

---

## Features

- Live statistics that update automatically
- Store essential information without overwhelming the user
- Update any application at any time
- Delete applications that are no longer relevant
- Scalable foundation for more advanced features

---

## Tech Stack

JobTrackr is built using:

- **React (Vanilla)** — frontend
- **Supabase** — database and authentication

This architectural decision — avoiding a fully custom backend — was made to speed up development while reducing overall complexity.

Additional libraries and tools include:

- **Tailwind CSS** — styling
- **Recharts** — data visualization

---

## Setup Instructions

You have two ways to use JobTrackr:

### Option 1: Use the Hosted Version

1. Open JobTrackr in your browser  
2. Create a user account  
3. Log in and start tracking applications immediately  

### Option 2: Run Locally

1. Clone or download this repository  
2. Run:

   ```bash
   npm install
**Important: JobTrackr does not include its own backend**

- **Option A**: Create your own Supabase project and connect it to your local instance

- **Option B**: Build your own backend and adapt JobTrackr’s logic accordingly
  
Feel free to experiment and customize the architecture.

---

## What I Learned

Building JobTrackr taught me the importance of prioritizing a project’s **core objective** over unnecessary complexity. Since JobTrackr’s functionality is intentionally simple (for now), simplifying the architecture was the right choice.

This approach was made possible through React’s core features — state management, side effects, memoization — and by composing reusable components styled with Tailwind CSS. The result is a modern, responsive, and maintainable application.

---

## Future Improvements

Planned features include:

- Email reminders for application follow-ups
- Light mode toggle
- Application deadline tracking
- Interview preparation notes
