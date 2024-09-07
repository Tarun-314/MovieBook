import { Component, OnDestroy, OnInit } from '@angular/core';
declare var emailjs: any;
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  ngOnInit() {
    emailjs.init("CIxDEI1DWUPlcMyIE"); 
    console.log("Connected to EmailJS");
  }

  ngOnDestroy(): void {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }  

  onSubmit(form: any) {
    if (form.invalid) {
      form.submitted = true;
      return;
    }

    const name = form.value.name;
    const email = form.value.email;
    const phone = form.value.phone;
    const message = form.value.message;

    const templateParams = {
      to_email: "shobithgampa1313@gmail.com",
      from_name: name,
      from_email: email,
      message: `
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        
        Message:
        ${message}
      `
    };

    emailjs.send("service_bt6zsg7", "template_q8ndlce", templateParams)
      .then((response: any) => {
        console.log('Email sent successfully:', response);
        this.showModal('Message Sent', 'Thank you for your message. We will get back to you soon!');
        form.reset();
      }, (error: any) => {
        console.error('Email sending failed:', error);
        this.showModal('Error', 'Sorry, there was an error sending your message. Please try again later.');
      });
  }

  showModal(title: string, message: string) {
    const resultModalLabel = document.getElementById('resultModalLabel');
    const resultModalBody = document.getElementById('resultModalBody');
    if (resultModalLabel && resultModalBody) {
      resultModalLabel.textContent = title;
      resultModalBody.textContent = message;
      const resultModal = new bootstrap.Modal(document.getElementById('resultModal') as HTMLElement);
      resultModal.show();

      // Close the modal automatically after 5 seconds
      setTimeout(() => {
        resultModal.hide();
      }, 3000);
    }
  }
}
