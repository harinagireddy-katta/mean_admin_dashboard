import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent implements OnInit {
  contentList: any[] = [];
  newContent = {
    title: '',
    body: '',
    status: 'draft'
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.apiService.getContent().subscribe((data: any) => {
      this.contentList = data;
    });
  }

  createContent() {
    this.apiService.createContent(this.newContent).subscribe(() => {
      this.loadContent();
      this.newContent = { title: '', body: '', status: 'draft' }; // Reset form
    });
  }

  deleteContent(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deleteContent(id).subscribe(() => {
        this.loadContent();
      });
    }
  }
}
