import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: '../app.scss',
})
export class ContactComponent {
  contactSubmitLoading = false;
  contactSubmitResult: 'success' | 'error' | null = null;
  private readonly contactFormEndpoint = 'https://formspree.io/f/xlgwwwve';

  ngOnInit(): void {}
  async onContactSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = (data.get('name') as string) || '';
    const email = (data.get('email') as string) || '';
    const subject = (data.get('subject') as string) || '7 Factors – Contact';
    const message = (data.get('message') as string) || '';

    this.contactSubmitResult = null;
    this.contactSubmitLoading = true;
    try {
      const res = await fetch(this.contactFormEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        this.contactSubmitResult = 'success';
        form.reset();
      } else {
        this.contactSubmitResult = 'error';
      }
    } catch {
      this.contactSubmitResult = 'error';
    } finally {
      this.contactSubmitLoading = false;
    }
  }
}
