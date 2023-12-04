import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Repository } from './repository.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  githubUsername: string = '';
  repositories: Repository[] = [];
  userName: string = '';
  userBio: string = '';
  twitterUsername: string = '';
  userLocation: string = '';
  userAvatar: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  userHtmlUrl: string = '';
  showRepositories: boolean = false;
  repoLanguages: { [key: string]: { [key: string]: number } } = {}; // Store languages for each repository

  constructor(private apiService: ApiService, private router: Router) {}

  getUserData() {
    if (this.githubUsername) {
      this.apiService.getUser(this.githubUsername).subscribe(
        (user: any) => {
          this.userName = user.name;
          this.userBio = user.bio;
          this.twitterUsername = user.twitter_username;
          this.userLocation = user.location;
          this.userAvatar = user.avatar_url;
          this.userHtmlUrl = user.html_url;
          this.showRepositories = true;

          this.apiService.getRepositories(this.githubUsername).subscribe(
            (repos: Repository[]) => {
              this.repositories = repos;
              // Fetch and store languages for each repository
              this.repositories.forEach((repo) => {
                this.apiService
                  .getLanguages(this.githubUsername, repo.name)
                  .subscribe(
                    (languages: { [key: string]: number }) => {
                      this.repoLanguages[repo.name] = languages;
                    },
                    (error: any) => {
                      console.error('Error fetching languages:', error);
                    }
                  );
              });
            },
            (error: any) => {
              console.error('Error fetching repositories:', error);
            }
          );
        },
        (error: any) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  nextPage() {
    this.currentPage++;
  }

  prevPage() {
    this.currentPage--;
  }
  get paginatedRepositories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.repositories.slice(startIndex, endIndex);
  }
  get totalPages() {
    return Math.ceil(this.repositories.length / this.itemsPerPage);
  }

  // Create an array of numbers for page buttons
  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isCurrentPage(page: number) {
    return this.currentPage === page;
  }
}
