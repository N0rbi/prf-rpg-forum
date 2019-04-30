import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character.interface';
import { CharacterService } from 'src/app/services/character.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrls: ['./character-creator.component.less']
})
export class CharacterCreatorComponent implements OnInit {
  character: Character = {
    name: '',
    race: '',
    type: '',
    hp: 10,
    attack: 10,
  };
  raceCollection = [];
  typeCollection = [];
  constructor(private characterService: CharacterService, private toastr: ToastrService) { }

  ngOnInit() {
    this.raceCollection = this.characterService.raceCollection;
    this.typeCollection = this.characterService.typeCollection;
  }

  createCharacter() {
    this.calculateStats();
    this.characterService.createNewCharacter(this.character).subscribe(res => {
      this.toastr.success(res.message);
    }, err => {
      this.toastr.error(err.message);
    });
  }

  private calculateStats() {
    switch (this.character.race) {
      case 'orc': {
        this.character.hp *= 1.5;
        break;
      }
      case 'elf': {
        this.character.hp *= 0.5;
        break;
      }
      default: {
        break;
      }
    }

    switch (this.character.type) {
      case 'assassin': {
        this.character.attack *= 1.1;
        break;
      }
      case 'bowman': {
        this.character.attack *= 0.9;
        break;
      }
      case 'mage': {
        this.character.attack *= 1.2;
        break;
      }
    }
  }

}
