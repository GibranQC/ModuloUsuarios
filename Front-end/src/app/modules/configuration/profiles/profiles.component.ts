import { Component, OnInit } from '@angular/core';


import { ProfilesService } from 'src/app/services/profiles/profiles.service';
import { SweetalertService } from 'src/app/services/sweetalert.service';
import { SessionService } from 'src/app/services/session.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  public filter: any = {
    filtering: {},
    pager: {
      page: 1,
      limit: 5
    }
  }
  public profile: any = { permissions: [] };
  public profiles: Array<any> = [];
  public totalProfiles: number = 0;
  public profilesCopy: Array<any> = [];
  
  public profileSearch: string = '';
  public method: string = 'create';

  public permissions:any = {};
  public PROFILE_MODULE: number = 4;

  constructor(private session: SessionService,
              private swa: SweetalertService,
              private profilesService: ProfilesService) { }

  ngOnInit() {
    $('#inName').focus();
    // this.permissions = this.session.getPermissions(this.PROFILE_MODULE);

    this.newProfile();
    this.getProfiles();

    /*
    let profiles = this.profilesService.getOldProfiles();
    let modules = this.profilesService.getModules();

    for (let a = 0; a < profiles.length; a++) {
      let newObject = Object.assign({}, profiles[a].permissions, modules);
      for (let b = 0; b < profiles[a].permissions.length; b++) {
        
        for (let c = 0; c < profiles[a].permissions[b].privileges.length; c++) {
          newObject[b].privileges[c].active = profiles[a].permissions[b].privileges[c].active;
        }
      }
      profiles[a].permissions = newObject;
    }
    console.error(profiles);
    */
    /*
    for (let a = 0; a < modules.length; a++) {
      for (let b = 0; b < profiles.length; b++) {
        let exist = false;
        for (let c = 0; c < profiles[b].permissions.length; c++) {
          if(modules[a].moduleId == profiles[b].permissions[c].moduleId){
            exist = true;
            for (let d = 0; d < modules[a].privileges.length; d++) {
              let exist2 = false;
              for (let e = 0; e < profiles[b].permissions[c].privileges.length; e++) {
                if(modules[a].privileges[d].name == profiles[b].permissions[c].privileges[e].name){
                  exist2 = true;
                  break;
                }
              }
              if(!exist2)
                profiles[b].permissions[c].privileges.push(modules[a].privileges[d]);
            }
          }
        }
        if(!exist)
          profiles[b].permissions.push(modules[a]);
      }
    }

    console.warn(profiles);*/
    
  }

  getProfiles(){
    this.swa.loading('Obteniendo perfiles.');
    console.log(this.filter);
    this.profilesService.getProfiles(this.filter)
      .subscribe((data: any) => {
        this.swa.close();
        console.log(data);
        if (data && data.data) {
          this.totalProfiles = data.count;
          this.profiles = data.data;
        }else {
          this.totalProfiles = 0;
          this.profiles = [];
        }

      }, (error)  => {
        this.swa.info(error.message, '');
      });
  }

  createProfile(){
    console.log(this.profile);
    this.swa.loading('Guardando perfil.');

    this.profilesService.createProfile(this.profile)
      .subscribe((data: any) => {
        this.swa.close();
        console.log(data);
        if(data && data.success){
          this.swa.success('Perfil guardado.', '', () => {
            this.getProfiles();
            this.newProfile();
          })
        }else{
          this.swa.info(data.message, '');
        }

      }, (error)  => {
        this.swa.info(error.message, '');
      });
  }

  updateProfile(){
    console.log(this.profile);
    this.swa.loading('Actualizando perfil.');

    this.profilesService.updateProfile(this.profile)
      .subscribe((data: any) => {
        this.swa.close();
        console.log(data);
        if(data && data.success){
          this.swa.success('Perfil actualizado.', '', () => {
            this.getProfiles();
            this.newProfile();
          })
        }else{
          this.swa.info(data.message, '');
        }

      }, (error)  => {
        this.swa.info(error.message, '');
      });
  }

  newProfile(){
    this.profilesService.initProfile()
      .subscribe((data: any) => {
        this.swa.close();
        this.method = 'create';

        delete this.profile._id;
        this.profile.name = '';
        this.profile.description = '';
        this.profile.permissions = data.data;
        delete this.profile.__v;

        console.log(this.profile);
        //setTimeout(() => {
          $('#profileForm')[0].reset();
        //}, 100);
      }, (error)  => {
        this.swa.info(error.message, '');
      });
  }

  selectProfile(index){
    this.method = 'update';

    this.profile = JSON.parse(JSON.stringify(this.profiles[index]));
    for (let i = 0; i < this.profile.permissions.length; i++) {
      /*this.profile.permissions[i].isSelected = true;
      for (let j = 0; j < this.profile.permissions[i].privileges.length; j++) {
        if(!this.profile.permissions[i].privileges[j].active){
          this.profile.permissions[i].isSelected = false;
          break;
        }
      }*/
      this.validateAll(i);
    }
  }

  selectOrDeselectActions(index){
    let value = this.profile.permissions[index].isSelected;

    for (let i = 0; i < this.profile.permissions[index].privileges.length; i++) {
      this.profile.permissions[index].privileges[i].active = value;
    }
  }

  validateAll(i){
    let isAllTrue = true;

    for (let k = 0; k < this.profile.permissions[i].privileges.length; k++) {
      if(!this.profile.permissions[i].privileges[k].active){
        isAllTrue = false;
        break;
      }
    }

    this.profile.permissions[i].isSelected = isAllTrue;
  }

  cancelProfile(){
    this.swa.confirm('¿Estas seguro de cancelar?', 'Todos los cambios que realizaste se perderan.', (result) => {
      if (result.value) {
        this.newProfile();
      }
    });
  }

  searchProfiles(){
    this.profiles = this.profilesCopy;

    if(this.profileSearch && this.profileSearch.length >= 2){
      this.profiles = this.profiles.filter((item) => {
        return (item.name.toUpperCase().indexOf(this.profileSearch.toUpperCase()) > -1);
      });
    }
  }

  textValidation(event){
    var regex = new RegExp(/^[a-zA-Z\sÑñ]+$/i);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }

  alphaValidation(event){
    var regex = new RegExp(/^[a-zA-Z0-9\sÑñ-]+$/i);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }
}
