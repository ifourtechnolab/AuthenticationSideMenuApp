import { Injectable, ApplicationRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { ActionSheetController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Injectable()
export class PhotoService {

  public arrPhotos: Photo[] = [];

  constructor(private storage: Storage, private camera: Camera, private loaderService: LoaderService, private file: File,
              private toastService: ToastService, private actionSheetController: ActionSheetController, private webview: WebView,
              private ref: ApplicationRef, private filePath: FilePath, private platform: Platform) { }

  loadSaved() {
    this.loaderService.present();
    this.storage.get('photos').then(photos => {
      this.arrPhotos = photos || [];
      this.loaderService.dismiss();
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }

  createFileName(): string {
    const d = new Date();
    const n = d.getTime();
    const newFileName = n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath: string, currentName: string, newFileName: string) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(() => {
      this.updateStoredImages(newFileName);
    }, err => {
      this.toastService.presentToast(JSON.stringify(err));
    });
  }

  async updateStoredImages(name: string) {
    const filePath = this.file.dataDirectory + name;
    const resPath = this.pathForImage(filePath);

    const newEntry: Photo = {
      Id: 1,
      Name: name,
      Path: resPath,
      Filepath: filePath
    };
    // this.arrPhotos = [newEntry, ...this.arrPhotos];
    this.arrPhotos.unshift(newEntry);
    this.storage.set('photos', this.arrPhotos);
    this.ref.tick();
  }

  pathForImage(img: string) {
    if (img === null) {
      return '';
    } else {
      const converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  deleteImage(imgEntry: Photo, position: number) {
    this.arrPhotos.splice(position, 1);
    this.storage.set('photos', this.arrPhotos);
    const correctPath = imgEntry.Filepath.substr(0, imgEntry.Filepath.lastIndexOf('/') + 1);

    this.file.removeFile(correctPath, imgEntry.Name).then(() => {
      this.toastService.presentToast('Image deleted successfully.');
    });
  }
}

class Photo {
  Id: number;
  Name: string;
  Path: string;
  Filepath: string;
}
