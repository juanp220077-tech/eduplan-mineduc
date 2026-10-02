import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyModalComponent } from './components/api-key-modal/api-key-modal.component';
import { CurriculumFormComponent } from './components/curriculum-form.component';
import { WorkspacePanelComponent } from './components/workspace-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ApiKeyModalComponent,
    CurriculumFormComponent,
    WorkspacePanelComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  apiKeyService = inject(ApiKeyService);
  isKeyModalOpen = false;
}