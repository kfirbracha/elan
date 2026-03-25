import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSubtitleAppearDirective } from '../../directives/loading-subtitle-appear.directive';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [TranslateModule, LoadingSubtitleAppearDirective],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss',
})
export class LoadingScreen {
  @Input() isLoading = false;
}
