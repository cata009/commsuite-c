import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-message-list-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col gap-0 animate-pulse">
      <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="flex flex-col p-4 border-b border-[#e6e6e6] bg-white gap-2">
        <!-- Header row -->
        <div class="flex justify-between items-start">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>

        <!-- Subject -->
        <div class="h-4 bg-gray-200 rounded w-3/4 mt-1"></div>

        <!-- Preview/Company -->
        <div class="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>

        <!-- Footer icons -->
        <div class="flex gap-2 mt-2">
          <div class="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div class="h-4 w-4 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  `
})
export class MessageListSkeletonComponent { }
