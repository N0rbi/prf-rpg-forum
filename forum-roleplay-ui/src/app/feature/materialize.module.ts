import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatGridListModule,
} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatGridListModule,
    MatExpansionModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatGridListModule,
    MatExpansionModule,
  ]
})
export class MaterialModule {}
