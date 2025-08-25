import {Component, OnInit} from '@angular/core';
import {UserFilesService} from "@services/user-files.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-display-video-manager',
  imports: [
    NgForOf
  ],
  templateUrl: './display-video-manager.component.html',
  styleUrl: './display-video-manager.component.scss'
})
export class DisplayVideoManagerComponent implements OnInit {
  folderPath: string = '';
  files: string[] = [];

  constructor(private userFilesService: UserFilesService) {}

  ngOnInit(): void {
    // Abonnement pour le chemin du dossier
    this.userFilesService.getUserFolder().subscribe(path => {
      this.folderPath = path;
    });

    // Abonnement pour la liste des fichiers
    this.loadFiles();
  }

  loadFiles(): void {
    this.userFilesService.listFiles().subscribe(files => {
      this.files = files;
    });
  }

  refreshFiles(): void {
    this.loadFiles();
  }
}
