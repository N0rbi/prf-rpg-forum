import { NgModule } from '@angular/core';
import { MaterialModule } from '../../feature/materialize.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/header/header.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { CommonModule } from '@angular/common';
import { CharacterCreatorComponent } from './components/character-creator/character-creator.component';
import { GameCreatorComponent } from './components/game-creator/game-creator.component';
import { CharacterSelectorComponent } from './components/character-selector/character-selector.component';

@NgModule({
  declarations: [MainPageComponent, HeaderComponent, UserDetailsComponent, CharacterCreatorComponent, GameCreatorComponent, CharacterSelectorComponent],
  imports: [CommonModule, MaterialModule],
  providers: [],
  exports: [MainPageComponent],
  entryComponents: [GameCreatorComponent, CharacterSelectorComponent]
})
export class MainPageModule { }
