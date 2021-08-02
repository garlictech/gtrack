import { Component } from '@angular/core';
/* import { LanguageSelectorComponent as LanguageSelectorComponentBase } from '@gtrack/shared/localization/data-access';
 */import { faLanguage, IconDefinition } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'gtrack-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  icon: IconDefinition = faLanguage;
}
