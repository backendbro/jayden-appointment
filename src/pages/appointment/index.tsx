// src/pages/appointment/index.tsx
import React, { useEffect } from "react";
import "../../styles/appointment.css";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AppointmentPage(): JSX.Element {
  useEffect(() => {
    let jsPDF: any = null;
    let html2canvas: any = null;
    const cleanupFns: Array<() => void> = [];
    const bookedDates: Set<string> = new Set();

    (async function initClientScript() {
      // optional libs for PDF flows
      try {
        const jspdfMod = await import("jspdf");
        jsPDF = jspdfMod.jsPDF;
        const html2canvasMod = await import("html2canvas");
        html2canvas = html2canvasMod.default ?? html2canvasMod;
      } catch (err) {
        console.warn("PDF libraries not loaded:", err);
      }

      const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
        document.getElementById(id) as T | null;

      // DOM nodes
      const progressSteps = Array.from(
        document.querySelectorAll<HTMLElement>(".progress-step")
      );
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(".form-section")
      );
      const progressBar = $("progressBar") as HTMLElement | null;
      const serviceTypeSelect = $(
        "serviceTypeSelect"
      ) as HTMLSelectElement | null;
      const centerSelect = $("centerSelect") as HTMLSelectElement | null;
      const serviceNextBtn = $("serviceNextBtn") as HTMLButtonElement | null;
      const visaTypeWrapper = $("visaTypeWrapper") as HTMLElement | null;
      const visaTypeSelect = $("visaTypeSelect") as HTMLSelectElement | null;
      const calendarMonthLabel = $("calendarMonthLabel") as HTMLElement | null;
      const calendarGrid = $("calendarGrid") as HTMLElement | null;
      const timeSlotsContainer = $("timeSlotsContainer") as HTMLElement | null;
      const calPrevBtn = $("calPrevBtn") as HTMLButtonElement | null;
      const calNextBtn = $("calNextBtn") as HTMLButtonElement | null;
      const applicantName = $("applicantName") as HTMLInputElement | null;
      const applicantSurname = $("applicantSurname") as HTMLInputElement | null;
      const applicantEmail = $("applicantEmail") as HTMLInputElement | null;
      const applicantPhone = $("applicantPhone") as HTMLInputElement | null;
      const passportFile = $("passportFile") as HTMLInputElement | null;
      const passportPhotoFile = $(
        "passportPhotoFile"
      ) as HTMLInputElement | null;
      const applicantNextBtn = $(
        "applicantNextBtn"
      ) as HTMLButtonElement | null;
      const final_name = $("final_name") as HTMLElement | null;
      const final_email = $("final_email") as HTMLElement | null;
      const final_phone = $("final_phone") as HTMLElement | null;
      const final_service = $("final_service") as HTMLElement | null;
      const final_status = $("final_status") as HTMLElement | null;
      const final_processing_time = $(
        "final_processing_time"
      ) as HTMLElement | null;
      const final_tracking = $("final_tracking") as HTMLElement | null;
      const final_slot_date = $("final_slot_date") as HTMLElement | null;
      const final_center_address = $(
        "final_center_address"
      ) as HTMLElement | null;
      const downloadPdfBtn = $("downloadPdfBtn") as HTMLButtonElement | null;
      const saveToBackendBtn = $(
        "saveToBackendBtn"
      ) as HTMLButtonElement | null;

      // local state
      let currentStep = 0;
      let selectedDate: Date | null = null;
      let selectedTime: string | null = null;
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      let generatedRef: string | null = null;
      let appointmentData: any = {};

      if (!calendarGrid || !timeSlotsContainer) {
        console.warn("Appointment page: required DOM nodes missing.");
        return;
      }

      // fetch booked appointments for next 6 months
      async function fetchBookedAppointments() {
        try {
          const now = new Date();
          const sixMonthsFromNow = new Date(now);
          sixMonthsFromNow.setMonth(now.getMonth() + 6);

          const { data, error } = await supabase
            .from("appointments")
            .select("appointment_date, appointment_time, center")
            .gte("appointment_date", now.toISOString())
            .lte("appointment_date", sixMonthsFromNow.toISOString())
            .order("appointment_date", { ascending: true });

          if (error) {
            console.error("Error fetching appointments:", error);
            return;
          }

          bookedDates.clear();
          if (data) {
            data.forEach((appointment: any) => {
              const date = new Date(appointment.appointment_date);
              const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")}`;
              bookedDates.add(dateString);
            });
          }
        } catch (err) {
          console.error("Failed to fetch appointments:", err);
        }
      }

      // calendar rendering
      function renderCalendar(month: number, year: number) {
        while (calendarGrid.children.length > 7) {
          calendarGrid.removeChild(calendarGrid.lastChild as ChildNode);
        }

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        if (calendarMonthLabel)
          calendarMonthLabel.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
          const emptyCell = document.createElement("div");
          emptyCell.className = "calendar-day disabled";
          emptyCell.setAttribute("aria-hidden", "true");
          calendarGrid.appendChild(emptyCell);
        }

        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
          const dayCell = document.createElement("button");
          dayCell.type = "button";
          dayCell.className = "calendar-day";
          dayCell.textContent = String(i);

          const cellDate = new Date(year, month, i);
          const dateString = `${cellDate.getFullYear()}-${(
            cellDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${cellDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          if (bookedDates.has(dateString)) {
            dayCell.classList.add("booked");
            dayCell.setAttribute("aria-disabled", "true");
            dayCell.disabled = true;
          } else if (
            cellDate < today &&
            cellDate.toDateString() !== today.toDateString()
          ) {
            dayCell.classList.add("disabled");
            dayCell.disabled = true;
          } else if (cellDate.toDateString() === today.toDateString()) {
            dayCell.classList.add("today");
            dayCell.setAttribute("aria-current", "date");
          }

          const onClick = () => {
            if (dayCell.disabled) return;
            document
              .querySelectorAll(".calendar-day")
              .forEach((d) => d.classList.remove("selected"));
            dayCell.classList.add("selected");
            selectedDate = new Date(year, month, i);
          };
          dayCell.addEventListener("click", onClick);
          cleanupFns.push(() => dayCell.removeEventListener("click", onClick));

          calendarGrid.appendChild(dayCell);
        }
      }

      // time slots
      function generateTimeSlots() {
        timeSlotsContainer.innerHTML = "";
        const startHour = 9;
        const endHour = 16;
        for (let hour = startHour; hour <= endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            if (hour === endHour && minute === 30) break;
            const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${
              minute === 0 ? "00" : minute
            } ${hour >= 12 ? "PM" : "AM"}`;
            const timeSlot = document.createElement("button");
            timeSlot.type = "button";
            timeSlot.className = "time-slot";
            timeSlot.textContent = timeString;
            const onClick = () => {
              document
                .querySelectorAll(".time-slot")
                .forEach((slot) => slot.classList.remove("selected"));
              timeSlot.classList.add("selected");
              selectedTime = timeString;
            };
            timeSlot.addEventListener("click", onClick);
            cleanupFns.push(() =>
              timeSlot.removeEventListener("click", onClick)
            );
            timeSlotsContainer.appendChild(timeSlot);
          }
        }
      }

      function updateProgressBar() {
        if (progressBar) {
          const progressPercentage =
            (currentStep / (progressSteps.length - 1)) * 100;
          progressBar.style.width = `${progressPercentage}%`;
        }
        progressSteps.forEach((step, index) => {
          if (index < currentStep) {
            step.classList.add("completed");
            step.classList.remove("active");
          } else if (index === currentStep) {
            step.classList.add("active");
            step.classList.remove("completed");
          } else {
            step.classList.remove("active", "completed");
          }
        });
      }

      async function showStep(stepIndex: number) {
        sections.forEach((section, index) => {
          if (index === stepIndex) section.classList.add("active");
          else section.classList.remove("active");
        });
        currentStep = stepIndex;
        updateProgressBar();

        if (currentStep === 1) {
          await fetchBookedAppointments();
          renderCalendar(currentMonth, currentYear);
        }

        if (currentStep === 3) populateConfirmation();
      }

      function toggleVisaSelector() {
        if (!serviceTypeSelect || !visaTypeWrapper) return;
        if (serviceTypeSelect.value.includes("Visa"))
          visaTypeWrapper.style.display = "block";
        else visaTypeWrapper.style.display = "none";
      }

      function updateServiceNextState() {
        if (!serviceNextBtn || !serviceTypeSelect || !centerSelect) return;
        serviceNextBtn.disabled = !(
          serviceTypeSelect.value && centerSelect.value
        );
      }

      function collectAppointmentData() {
        return {
          service: serviceTypeSelect?.value,
          center: centerSelect?.value,
          visaType: visaTypeSelect?.value,
          date: selectedDate,
          time: selectedTime,
          applicant: {
            firstName: applicantName?.value,
            lastName: applicantSurname?.value,
            email: applicantEmail?.value,
            phone: applicantPhone?.value,
            program: (
              document.getElementById(
                "desireProgram"
              ) as HTMLInputElement | null
            )?.value,
            course: (
              document.getElementById("desireCourse") as HTMLInputElement | null
            )?.value,
            additionalEmail: (
              document.getElementById("emailAddress") as HTMLInputElement | null
            )?.value,
          },
          documents: {
            passport: passportFile?.files?.[0]?.name ?? "",
            photo: passportPhotoFile?.files?.[0]?.name ?? "",
            oLevel:
              (document.getElementById("olevelCert") as HTMLInputElement | null)
                ?.files?.[0]?.name ?? "",
            aLevel:
              (document.getElementById("alevelCert") as HTMLInputElement | null)
                ?.files?.[0]?.name ?? "",
            bachelor:
              (
                document.getElementById(
                  "bachelorCert"
                ) as HTMLInputElement | null
              )?.files?.[0]?.name ?? "",
            transcript:
              (
                document.getElementById(
                  "transcriptFile"
                ) as HTMLInputElement | null
              )?.files?.[0]?.name ?? "",
            others:
              (document.getElementById("othersFile") as HTMLInputElement | null)
                ?.files?.[0]?.name ?? "",
          },
          addresses: {
            secondary: (
              document.getElementById(
                "addrSecondary"
              ) as HTMLInputElement | null
            )?.value,
            highSchool: (
              document.getElementById(
                "addrHighSchool"
              ) as HTMLInputElement | null
            )?.value,
            university: (
              document.getElementById(
                "addrUniversity"
              ) as HTMLInputElement | null
            )?.value,
          },
          trackingNumber: generatedRef,
          status: "Processing",
        };
      }

      function populateConfirmation() {
        if (final_name)
          final_name.textContent = `${applicantName?.value ?? ""} ${
            applicantSurname?.value ?? ""
          }`;
        if (final_email) final_email.textContent = applicantEmail?.value ?? "";
        if (final_phone) final_phone.textContent = applicantPhone?.value ?? "";

        try {
          if (serviceTypeSelect && final_service) {
            const serviceData = JSON.parse(serviceTypeSelect.value);
            final_service.textContent = serviceData.name;
          }
        } catch (e) {
          if (final_service && serviceTypeSelect)
            final_service.textContent =
              serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
        }

        if (!generatedRef)
          generatedRef = "REF-" + Math.floor(100000 + Math.random() * 900000);
        if (final_tracking) final_tracking.textContent = generatedRef;

        if (selectedDate && final_slot_date) {
          final_slot_date.textContent = selectedDate.toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
        } else if (final_slot_date)
          final_slot_date.textContent = "Not selected";

        if (final_center_address && centerSelect) {
          final_center_address.textContent =
            centerSelect.options[centerSelect.selectedIndex].text;
        }

        appointmentData = collectAppointmentData();
      }

      // PDF generation
      async function downloadAppointmentSlip() {
        if (!jsPDF) {
          alert("PDF library not available.");
          return;
        }

        try {
          const pdf = new jsPDF("p", "mm", "a4");
          pdf.setFillColor(240, 240, 240);
          pdf.rect(0, 0, 210, 297, "F");
          pdf.setFillColor(59, 130, 246);
          pdf.rect(0, 0, 210, 40, "F");
          pdf.setFontSize(20);
          pdf.setTextColor(255, 255, 255);
          pdf.text("Government Services", 105, 20, { align: "center" });
          pdf.setFontSize(16);
          pdf.text("Appointment Confirmation", 105, 30, { align: "center" });
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, "bold");
          pdf.text("Tracking #:", 20, 60);
          pdf.setFont(undefined, "normal");
          pdf.text(generatedRef || "", 60, 60);

          const details = [
            [
              "Name:",
              `${applicantName?.value || ""} ${applicantSurname?.value || ""}`,
            ],
            ["Email:", applicantEmail?.value || ""],
            ["Phone:", applicantPhone?.value || ""],
            ["Service:", final_service?.textContent || ""],
            [
              "Appointment Date:",
              selectedDate ? selectedDate.toLocaleDateString() : "Not selected",
            ],
            ["Time Slot:", selectedTime || "Not selected"],
            ["Center:", final_center_address?.textContent || ""],
          ];

          let yPosition = 80;
          details.forEach(([label, value]) => {
            pdf.setFont(undefined, "bold");
            pdf.text(label, 20, yPosition);
            pdf.setFont(undefined, "normal");
            pdf.text(String(value), 60, yPosition);
            yPosition += 10;
          });

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            "Please bring this slip and required documents to your appointment",
            105,
            250,
            { align: "center" }
          );
          pdf.text("Thank you for using our services", 105, 260, {
            align: "center",
          });

          pdf.setDrawColor(59, 130, 246);
          pdf.setLineWidth(0.5);
          pdf.line(15, 45, 195, 45);
          pdf.line(15, 270, 195, 270);

          pdf.save(`appointment_slip_${generatedRef || "x"}.pdf`);
        } catch (err) {
          console.error("Error generating PDF", err);
          alert("Error generating PDF. Check console.");
        }
      }

      // file validation & Cloudinary helper
      function assertFileIsValid(file: File) {
        if (!(file instanceof File)) throw new Error("Not a File object");
        if (file.size === 0) throw new Error("File is empty");
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) throw new Error("File too large (>10MB)");
      }

      async function uploadFileToCloudinary(file: File, folder: string) {
        const CLOUD_NAME =
          (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || "";
        const UPLOAD_PRESET =
          (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || "";
        if (!CLOUD_NAME || !UPLOAD_PRESET)
          throw new Error("Cloudinary not configured.");
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", UPLOAD_PRESET);
        if (folder) fd.append("folder", folder);
        const resp = await fetch(url, { method: "POST", body: fd });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Cloudinary upload failed: ${resp.status} ${text}`);
        }
        const json = await resp.json();
        if (!json.secure_url)
          throw new Error("Cloudinary returned no secure_url");
        return json.secure_url as string;
      }

      // friendly success notification (DOM element)
      function showSuccessNotification() {
        const notification = document.createElement("div");
        notification.className = "success-notification";
        notification.innerHTML = `
          <div class="success-icon" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="40" height="40" aria-hidden="true">
              <path class="checkmark" fill="none" stroke="#4CAF50" stroke-width="8" d="M20,50 L40,70 L80,30"/>
            </svg>
          </div>
          <div class="success-content">
            <h3>Appointment Confirmed!</h3>
            <p>Your appointment has been successfully scheduled. A confirmation email has been sent.</p>
          </div>
          <button class="close-notification" aria-label="Close">&times;</button>
        `;
        if (!document.getElementById("success-notification-styles")) {
          const styles = document.createElement("style");
          styles.id = "success-notification-styles";
          styles.textContent = `
            .success-notification { position: fixed; top: 20px; right: 20px; background: white; border-left: 4px solid #4CAF50; border-radius: 6px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); padding: 14px; display:flex; gap:10px; align-items:center; z-index:10000; max-width:420px; animation: slideInNotif .45s ease-out; }
            @keyframes slideInNotif { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
            .success-content h3 { margin:0 0 6px 0; color:#2E7D32; font-size:1rem; }
            .success-content p { margin:0; color:#333; font-size:0.9rem; }
            .close-notification { background:none; border:none; font-size:20px; cursor:pointer; margin-left:8px; color:#777; }
            .checkmark { stroke-dasharray:100; stroke-dashoffset:100; animation:drawCheck 0.5s ease-in-out 0.2s forwards; }
            @keyframes drawCheck { to { stroke-dashoffset: 0 } }
            @keyframes slideOutNotif { from { transform: translateX(0); opacity:1 } to { transform: translateX(100%); opacity:0 } }
          `;
          document.head.appendChild(styles);
        }
        document.body.appendChild(notification);
        const closeBtn = notification.querySelector(".close-notification");
        closeBtn?.addEventListener("click", () => {
          notification.style.animation = "slideOutNotif .4s forwards";
          setTimeout(() => notification.remove(), 400);
        });
        setTimeout(() => {
          if (notification.parentElement) {
            notification.style.animation = "slideOutNotif .4s forwards";
            setTimeout(() => notification.remove(), 400);
          }
        }, 5000);
      }

      // save to backend (upload & supabase insert)
      async function saveToBackend() {
        if (!saveToBackendBtn) return;
        const originalText = saveToBackendBtn.innerHTML;
        saveToBackendBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
        saveToBackendBtn.disabled = true;

        try {
          if (!generatedRef) {
            generatedRef =
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? (crypto as any).randomUUID()
                : fallbackUUID();
          }

          appointmentData = collectAppointmentData();

          const fileInputs: Record<string, HTMLInputElement | null> = {
            passport: passportFile ?? null,
            photo: passportPhotoFile ?? null,
            oLevel: document.getElementById(
              "olevelCert"
            ) as HTMLInputElement | null,
            aLevel: document.getElementById(
              "alevelCert"
            ) as HTMLInputElement | null,
            bachelor: document.getElementById(
              "bachelorCert"
            ) as HTMLInputElement | null,
            transcript: document.getElementById(
              "transcriptFile"
            ) as HTMLInputElement | null,
            others: document.getElementById(
              "othersFile"
            ) as HTMLInputElement | null,
          };

          const uploadedUrls: Record<string, string> = {};
          for (const [key, inputEl] of Object.entries(fileInputs)) {
            const file = inputEl?.files?.[0];
            if (!file) continue;
            assertFileIsValid(file);
            const folder = generatedRef ?? "appointments-temp";
            const secureUrl = await uploadFileToCloudinary(
              file,
              `appointments/${folder}`
            );
            uploadedUrls[key] = secureUrl;
          }

          let serviceVal: any = appointmentData.service;
          try {
            if (typeof serviceVal === "string")
              serviceVal = JSON.parse(serviceVal);
          } catch {}

          const record = {
            tracking_number: generatedRef,
            service: serviceVal,
            center: appointmentData.center ?? null,
            visa_type: appointmentData.visaType ?? null,
            appointment_date: appointmentData.date
              ? new Date(appointmentData.date).toISOString()
              : null,
            appointment_time: appointmentData.time ?? null,
            applicant: appointmentData.applicant ?? null,
            addresses: appointmentData.addresses ?? null,
            documents: uploadedUrls,
            status: appointmentData.status ?? "Processing",
            raw_payload: appointmentData,
          };

          const { error: insertError } = await supabase
            .from("appointments")
            .insert([record], { returning: "minimal" });
          if (insertError) throw insertError;

          if (final_tracking) final_tracking.textContent = generatedRef ?? "";
          showSuccessNotification();
        } catch (err: any) {
          console.error("Save failed", err);
          alert(
            "Failed to save appointment: " +
              (err?.message || JSON.stringify(err))
          );
        } finally {
          if (saveToBackendBtn) {
            saveToBackendBtn.innerHTML = originalText;
            saveToBackendBtn.disabled = false;
          }
        }
      }

      function fallbackUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }

      // event bindings
      if (serviceTypeSelect) {
        const onChange = () => {
          updateServiceNextState();
          toggleVisaSelector();
        };
        serviceTypeSelect.addEventListener("change", onChange);
        cleanupFns.push(() =>
          serviceTypeSelect.removeEventListener("change", onChange)
        );
      }
      if (centerSelect) {
        const onChange = () => updateServiceNextState();
        centerSelect.addEventListener("change", onChange);
        cleanupFns.push(() =>
          centerSelect.removeEventListener("change", onChange)
        );
      }
      if (serviceNextBtn) {
        const onClick = () => {
          if (
            serviceTypeSelect &&
            centerSelect &&
            serviceTypeSelect.value &&
            centerSelect.value
          )
            showStep(1);
        };
        serviceNextBtn.addEventListener("click", onClick);
        cleanupFns.push(() =>
          serviceNextBtn.removeEventListener("click", onClick)
        );
      }
      if (calPrevBtn) {
        const onClick = () => {
          currentMonth--;
          if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
          }
          renderCalendar(currentMonth, currentYear);
        };
        calPrevBtn.addEventListener("click", onClick);
        cleanupFns.push(() => calPrevBtn.removeEventListener("click", onClick));
      }
      if (calNextBtn) {
        const onClick = () => {
          currentMonth++;
          if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
          renderCalendar(currentMonth, currentYear);
        };
        calNextBtn.addEventListener("click", onClick);
        cleanupFns.push(() => calNextBtn.removeEventListener("click", onClick));
      }
      document.querySelectorAll(".next-step").forEach((btn) => {
        const onClick = () => {
          if (currentStep < sections.length - 1) showStep(currentStep + 1);
        };
        btn.addEventListener("click", onClick);
        cleanupFns.push(() => btn.removeEventListener("click", onClick));
      });
      document.querySelectorAll(".prev-step").forEach((btn) => {
        const onClick = () => {
          if (currentStep > 0) showStep(currentStep - 1);
        };
        btn.addEventListener("click", onClick);
        cleanupFns.push(() => btn.removeEventListener("click", onClick));
      });
      if (applicantNextBtn) {
        const onClick = () => {
          if (!applicantName?.value?.trim()) {
            alert("Please enter your first name");
            applicantName?.focus();
            return;
          }
          if (!applicantSurname?.value?.trim()) {
            alert("Please enter your last name");
            applicantSurname?.focus();
            return;
          }
          if (!applicantEmail?.value?.includes("@")) {
            alert("Please enter a valid email");
            applicantEmail?.focus();
            return;
          }
          if (!applicantPhone?.value?.trim()) {
            alert("Please enter your phone");
            applicantPhone?.focus();
            return;
          }
          if (!passportFile?.files?.length) {
            alert("Please upload passport scan");
            passportFile?.focus();
            return;
          }
          if (!passportPhotoFile?.files?.length) {
            alert("Please upload passport photo");
            passportPhotoFile?.focus();
            return;
          }
          showStep(currentStep + 1);
        };
        applicantNextBtn.addEventListener("click", onClick);
        cleanupFns.push(() =>
          applicantNextBtn.removeEventListener("click", onClick)
        );
      }
      if (downloadPdfBtn) {
        const onClick = downloadAppointmentSlip;
        downloadPdfBtn.addEventListener("click", onClick);
        cleanupFns.push(() =>
          downloadPdfBtn.removeEventListener("click", onClick)
        );
      }
      if (saveToBackendBtn) {
        const onClick = saveToBackend;
        saveToBackendBtn.addEventListener("click", onClick);
        cleanupFns.push(() =>
          saveToBackendBtn.removeEventListener("click", onClick)
        );
      }

      // initialize
      function initCalendar() {
        renderCalendar(currentMonth, currentYear);
        generateTimeSlots();
      }
      function initEventListeners() {
        updateServiceNextState();
        updateProgressBar();
      }
      await fetchBookedAppointments();
      initCalendar();
      initEventListeners();
    })();

    // cleanup on unmount
    return () => {
      cleanupFns.forEach((fn) => {
        try {
          fn();
        } catch {
          /* ignore */
        }
      });
    };
  }, []);

  return (
    <>
      <nav id="mainNav">
        <div className="mx-auto nav-container px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                id="mobile-menu-toggle"
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="menu"
              >
                <svg
                  className="w-6 h-6 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <a href="/" className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=120&q=80&auto=format&fit=crop"
                  className="w-10 h-10 rounded-md object-cover shadow-sm"
                  alt="logo"
                  loading="lazy"
                />
                <span className="hidden md:inline-block text-lg font-semibold">
                  VisaPremium
                </span>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-sm font-medium hover:text-primary transition"
              >
                Home
              </a>

              <Link
                to="/appointment"
                className="vp-cta-appointment"
                id="vpAppointmentCta"
                aria-label="Make an appointment — open booking page"
              >
                <span className="vp-cta-icon" aria-hidden="true">
                  <i className="fas fa-calendar-check"></i>
                </span>
                <span>Make an Appointment</span>
                <span className="vp-cta-badge" aria-hidden="true">
                  Book
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              <button
                id="desktop-menu-toggle"
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="open sidebar"
              >
                <svg
                  className="w-5 h-5 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="appointment-container" style={{ marginTop: 100 }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Schedule an Appointment
          </h2>
          <p className="text-gray-600 mt-2">
            Complete the steps to book your appointment
          </p>
        </div>

        <div className="progress-container" aria-hidden={false}>
          <div className="progress-wrap">
            <div
              id="progressBar"
              className="progress-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="progress-step active" aria-current="step">
            <div className="progress-step-number">1</div>
            <div className="progress-step-label">Service Type</div>
          </div>

          <div className="progress-step">
            <div className="progress-step-number">2</div>
            <div className="progress-step-label">Appointment</div>
          </div>

          <div className="progress-step">
            <div className="progress-step-number">3</div>
            <div className="progress-step-label">Applicant Data</div>
          </div>

          <div className="progress-step">
            <div className="progress-step-number">4</div>
            <div className="progress-step-label">Confirmation</div>
          </div>
        </div>

        <div className="appointment-card card glass">
          {/* Step 1 */}
          <section
            className="form-section active"
            id="step1"
            aria-labelledby="step1Title"
          >
            <h3
              id="step1Title"
              className="text-2xl font-semibold text-gray-800 mb-6"
            >
              Select Service Type
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <i className="fas fa-concierge-bell text-4xl" aria-hidden />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">1.</span> Select service
                    type (e.g. Nigeria Visa, BVN Enrolment)
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold">2.</span> For Nigerian Visa,
                    select preferred center.
                  </p>
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="serviceTypeSelect" className="form-label">
                    Service Type
                  </label>
                  <select
                    id="serviceTypeSelect"
                    className="form-select"
                    aria-required
                  >
                    <option value="">Select a service</option>
                    <option value='{"id":1,"name":"Nigeria Visa","sortCode":"NVS"}'>
                      Nigeria Visa
                    </option>
                    <option value='{"id":2,"name":"BVN Enrolment","sortCode":"BVN"}'>
                      BVN Enrolment
                    </option>
                    <option value='{"id":3,"name":"Passport Services","sortCode":"PPT"}'>
                      Passport Services
                    </option>
                    <option value='{"id":5,"name":"NIN Enrollment","sortCode":"NIN"}'>
                      NIN Enrollment
                    </option>
                    <option value='{"id":6,"name":"USA Visa","sortCode":"USV"}'>
                      USA Visa
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="centerSelect" className="form-label">
                    Center
                  </label>
                  <select id="centerSelect" className="form-select">
                    <option value="">Select center</option>
                    <option value="1">London, UK</option>
                    <option value="20">Los Angeles, US</option>
                    <option value="7">Manchester, UK</option>
                    <option value="21">New York, US</option>
                    <option value="8">Paris, France</option>
                    <option value="26">The Hague, Netherlands</option>
                    <option value="17">Washington DC, USA</option>
                  </select>
                </div>

                <div className="text-right mt-6">
                  <button
                    id="serviceNextBtn"
                    className="btn cta-btn"
                    disabled
                    aria-disabled="true"
                  >
                    Next <i className="fas fa-arrow-right ml-2" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section
            className="form-section"
            id="step2"
            aria-labelledby="step2Title"
          >
            <h3
              id="step2Title"
              className="text-2xl font-semibold text-gray-800 mb-6"
            >
              Select Date &amp; Time
            </h3>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <p className="font-semibold mb-2">
                Please select appointment type
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>
                  Pick a date from the calendar.{" "}
                  <strong>Days grayed out are not available.</strong>
                </li>
                <li>Pick a slot from the available timeslots.</li>
                <li>If visa services please select visa type.</li>
              </ol>
            </div>

            <div
              id="visaTypeWrapper"
              className="form-group"
              style={{ display: "none" }}
            >
              <label htmlFor="visaTypeSelect" className="form-label">
                Visa Type
              </label>
              <select id="visaTypeSelect" className="form-select">
                <option value="">Select visa type</option>
                <option value="tourist">Tourist Visa</option>
                <option value="work">Work Visa</option>
                <option value="student">Student Visa</option>
                <option value="transit">Transit Visa</option>
              </select>
            </div>

            <div className="calendar-header">
              <button
                id="calPrevBtn"
                className="btn btn-outline"
                aria-label="Previous month"
              >
                <i className="fas fa-chevron-left" aria-hidden />
              </button>
              <div
                id="calendarMonthLabel"
                className="text-xl font-semibold text-gray-800"
                aria-live="polite"
              >
                November 2023
              </div>
              <button
                id="calNextBtn"
                className="btn btn-outline"
                aria-label="Next month"
              >
                <i className="fas fa-chevron-right" aria-hidden />
              </button>
            </div>

            <div
              className="calendar mb-6"
              id="calendarGrid"
              role="grid"
              aria-label="Appointment calendar"
            >
              <div className="calendar-weekday">Sun</div>
              <div className="calendar-weekday">Mon</div>
              <div className="calendar-weekday">Tue</div>
              <div className="calendar-weekday">Wed</div>
              <div className="calendar-weekday">Thu</div>
              <div className="calendar-weekday">Fri</div>
              <div className="calendar-weekday">Sat</div>
            </div>

            <h4 className="font-semibold text-gray-800 mb-4">
              Available Time Slots
            </h4>
            <div
              className="time-slots-container mb-6"
              id="timeSlotsContainer"
              aria-live="polite"
            ></div>

            <div className="flex justify-between">
              <button className="btn btn-outline prev-step">
                <i className="fas fa-arrow-left mr-2" aria-hidden /> Back
              </button>
              <button className="btn cta-btn next-step">
                Next <i className="fas fa-arrow-right ml-2" aria-hidden />
              </button>
            </div>
          </section>

          {/* Step 3 */}
          <section
            className="form-section"
            id="step3"
            aria-labelledby="step3Title"
          >
            <h3
              id="step3Title"
              className="text-2xl font-semibold text-gray-800 mb-6"
            >
              Applicant Information
            </h3>

            <form
              id="applicantForm"
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="applicantName" className="form-label">
                    First Name *
                  </label>
                  <input
                    id="applicantName"
                    name="APPLICANT_NAME"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="applicantSurname" className="form-label">
                    Last Name *
                  </label>
                  <input
                    id="applicantSurname"
                    name="APPLICANT_SURNAME"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="applicantEmail" className="form-label">
                    Email *
                  </label>
                  <input
                    id="applicantEmail"
                    name="APPLICANT_EMAIL"
                    type="email"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="applicantPhone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    id="applicantPhone"
                    name="APPLICANT_PHONE_NUMBER"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="desireProgram" className="form-label">
                    Desired Study Program
                  </label>
                  <input
                    id="desireProgram"
                    name="DESIRE_STUDY_PROGRAM"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="desireCourse" className="form-label">
                    Desired Course
                  </label>
                  <input
                    id="desireCourse"
                    name="DESIRE_COURSE"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passportFile" className="form-label">
                    Passport (scanned page) *
                  </label>
                  <input
                    id="passportFile"
                    name="PASSPORT"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                    required
                  />
                  <p className="text-sm">Accepted: PDF, JPG, PNG</p>
                </div>

                <div className="form-group">
                  <label htmlFor="passportPhotoFile" className="form-label">
                    Passport-sized Photo *
                  </label>
                  <input
                    id="passportPhotoFile"
                    name="PASSPORT_SIZED_PHOTO"
                    type="file"
                    className="form-file"
                    accept="image/*"
                    required
                  />
                  <p className="text-sm">Accepted: JPG, PNG (2x2 inches)</p>
                </div>

                <div className="form-group">
                  <label htmlFor="olevelCert" className="form-label">
                    O-Level Certificate
                  </label>
                  <input
                    id="olevelCert"
                    name="O_LEVEL_CERTIFICATE"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addrSecondary" className="form-label">
                    Secondary School Address
                  </label>
                  <input
                    id="addrSecondary"
                    name="ADDRESS_OF_SECONDARY_SCHOOL"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alevelCert" className="form-label">
                    A-Level Certificate
                  </label>
                  <input
                    id="alevelCert"
                    name="A_LEVEL_CERTIFICATE"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addrHighSchool" className="form-label">
                    High School Address
                  </label>
                  <input
                    id="addrHighSchool"
                    name="ADDRESS_OF_HIGH_SCHOOL"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bachelorCert" className="form-label">
                    Bachelor Certificate
                  </label>
                  <input
                    id="bachelorCert"
                    name="BACHELOR"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addrUniversity" className="form-label">
                    University Address
                  </label>
                  <input
                    id="addrUniversity"
                    name="ADDRESS_OF_UNIVERSITY"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transcriptFile" className="form-label">
                    Transcript
                  </label>
                  <input
                    id="transcriptFile"
                    name="TRANSCRIPT"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="othersFile" className="form-label">
                    Other Documents
                  </label>
                  <input
                    id="othersFile"
                    name="OTHERS"
                    type="file"
                    className="form-file"
                    accept=".pdf,image/*"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emailAddress" className="form-label">
                    Additional Email
                  </label>
                  <input
                    id="emailAddress"
                    name="EMAIL_ADDRESS"
                    type="email"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button className="btn btn-outline prev-step">
                  <i className="fas fa-arrow-left mr-2" aria-hidden /> Back
                </button>
                <button
                  id="applicantNextBtn"
                  type="button"
                  className="btn cta-btn"
                >
                  Next <i className="fas fa-arrow-right ml-2" aria-hidden />
                </button>
              </div>
            </form>
          </section>

          {/* Step 4 */}
          <section
            className="form-section"
            id="step4"
            aria-labelledby="step4Title"
          >
            <h3
              id="step4Title"
              className="text-2xl font-semibold text-gray-800 mb-6"
            >
              Appointment Confirmation
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="info-card card">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Appointment Details
                  </h4>

                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value" id="final_name">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value" id="final_email">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value" id="final_phone">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Service:</span>
                    <span className="info-value" id="final_service">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Appointment Status:</span>
                    <span className="info-value" id="final_status">
                      Processing
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time Slot:</span>
                    <span className="info-value" id="final_processing_time">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tracking Number:</span>
                    <span className="info-value" id="final_tracking">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Appointment Date:</span>
                    <span className="info-value" id="final_slot_date">
                      -
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Center:</span>
                    <span className="info-value" id="final_center_address">
                      -
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-6 flex flex-col">
                <div className="text-center mb-6">
                  <div className="success-icon">
                    <i className="fas fa-check-circle" aria-hidden />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                    Booking Successful!
                  </h5>
                  <p className="text-gray-600">
                    Your appointment has been successfully scheduled.
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <button id="downloadPdfBtn" className="btn cta-btn w-full">
                    <i className="fas fa-download mr-2" aria-hidden /> Download
                    Appointment Slip
                  </button>
                  <button
                    id="saveToBackendBtn"
                    className="btn vp-primary w-full"
                  >
                    <i className="fas fa-save mr-2" aria-hidden /> Save
                    Appointment
                  </button>
                  <button
                    className="btn btn-outline w-full"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print mr-2" aria-hidden /> Print
                    Checklist
                  </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    A confirmation email has been sent to your email address.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-6 text-gray-600">
          <p>
            Need help? Email{" "}
            <a href="mailto:support@govservices.gov" className="text-primary">
              support@govservices.gov
            </a>{" "}
            or call (123) 456-7890
          </p>
        </div>
      </main>

      <footer className="mt-8 mb-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Government Services. All rights reserved.
      </footer>

      <div
        id="appointment-slip"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: 600,
          background: "white",
          padding: 20,
        }}
      >
        <div className="slip-container">
          <div className="slip-header">
            <h2>Government Services</h2>
            <h3>Appointment Confirmation</h3>
            <p>
              Tracking #: <span id="pdf_tracking"></span>
            </p>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Name:</span>
            <span className="slip-value" id="pdf_name"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Email:</span>
            <span className="slip-value" id="pdf_email"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Phone:</span>
            <span className="slip-value" id="pdf_phone"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Service:</span>
            <span className="slip-value" id="pdf_service"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Appointment Date:</span>
            <span className="slip-value" id="pdf_slot_date"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Time Slot:</span>
            <span className="slip-value" id="pdf_time_slot"></span>
          </div>
          <div className="slip-detail">
            <span className="slip-label">Center:</span>
            <span className="slip-value" id="pdf_center"></span>
          </div>
          <div className="slip-footer">
            <p>
              Please bring this slip and required documents to your appointment
            </p>
            <p>Thank you for using our services</p>
          </div>
        </div>
      </div>
    </>
  );
}
