import { LogService } from 'ng2-log-service';
import { UserService } from './../../../services/user.service';
import { NgForm } from '@angular/forms';
import { UserProfileService } from './../../../services/user-profile.service';
import { AstroProfile } from './../../../models/astro-profile.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from "lodash";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [LogService]
})
export class EditProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('editProfileModal') _editProfileModal: any;

  public profile: AstroProfile;
  public expertiseItems: Array<{ id: string, text: string }> = [];
  public languageItems: Array<{ id: string, text: string }> = [];
  public experienceYears: Array<string> = [];
  public selectedExpertiseItems: Array<{ id: string, text: string }> = [];
  public selectedLanguageItems: Array<{ id: string, text: string }> = [];

  constructor(private astroProfileService: UserProfileService,
    private userService: UserService,
    private logService: LogService) {
    this.logService.namespace = 'EditProfileComponent';
  }

  ngOnInit() {

  }

  public refreshSelectedLanguages(value: any): void {
    this.selectedLanguageItems = value;
  }

  public refreshSelectedExpertises(value: any): void {
    this.selectedExpertiseItems = value;
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }


  ngAfterViewInit() {
    this.getExpertiseList();
    this.getLanguagesList();
    this.fillExperienceYears();
  }

  show(_profile: AstroProfile) {
    this.profile = _.cloneDeep(_profile);
    this.logService.info('inside edit of Astro Profile', this.profile.name);
    this.updateSelectedExpertiseList();
    this.updateSelectedLanguagesList();
    this._editProfileModal.show();
  }

  getLanguagesList() {
    this.astroProfileService.getLanguageList().subscribe(
      data => {

        data.forEach((entry) => {
          this.languageItems.push({
            id: entry.id,
            text: entry.name
          });
        });
      },
      error => {
        this.logService.error(error);
      });
  }

  getExpertiseList() {
    this.astroProfileService.getExpertiseList().subscribe(
      data => {
        data.categoryList.forEach((entry) => {
          this.expertiseItems.push({
            id: entry.id,
            text: entry.name
          });
        });
      },
      error => {
        this.logService.error(error);
      });
  }

  fillExperienceYears() {
    for (let i = 0; i < 51; i++) {
      this.experienceYears.push(i.toString());
    }
  }

  updateSelectedExpertiseList() {
    this.profile.expertise.forEach((entry) => {
      this.selectedExpertiseItems.push({
        id: entry.id,
        text: entry.name
      });
    });
  }

  updateSelectedLanguagesList() {
    this.profile.language.forEach((entry) => {
      this.selectedLanguageItems.push({
        id: entry.id,
        text: entry.name
      });
    });
  }

  updateProfile(form: NgForm) {

    let expertiseStr: string[] = [];
    let languageStr: string[] = [];

    this.selectedLanguageItems.forEach((entry) => {
      languageStr.push(entry.id);
    });

    this.selectedExpertiseItems.forEach((entry) => {
      expertiseStr.push(entry.id);
    });

    let profileData = {
      firstName: this.profile.fname,
      description: this.profile.description,
      userType: '1',
      expertise: expertiseStr.toString(),
      experience: this.profile.experience,
      userId: this.userService.getUser(),
      languages: languageStr.toString()
    }

    this.astroProfileService.updateAstroProfile(profileData).subscribe(
      data => {
        this.logService.debug('Received updateAstroProfile response', data);
        this._editProfileModal.hide();
      },
      error => {
        this.logService.error(error);
      });

  }

}
