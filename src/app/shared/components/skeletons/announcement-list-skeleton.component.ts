import { Component } from '@angular/core';

@Component({
    selector: 'app-announcement-list-skeleton',
    template: `
    <div class="flex flex-col gap-0 animate-pulse">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="flex flex-col p-4 border-b border-unicredit-gray bg-white gap-2">
            <!-- Header row -->
            <div class="flex justify-between items-start">
                <div class="h-4 bg-unicredit-gray-lighter rounded w-1/3"></div>
                <div class="h-3 bg-unicredit-gray-lighter rounded w-16"></div>
            </div>
            <!-- Title row -->
            <div class="flex justify-between items-center mt-1">
                <div class="h-4 bg-unicredit-gray-lighter rounded w-3/4"></div>
                <div class="flex gap-2">
                    <div class="h-4 w-4 bg-unicredit-gray-lighter rounded"></div>
                    <div class="h-4 w-4 bg-unicredit-gray-lighter rounded"></div>
                </div>
            </div>
            <!-- Preview row -->
            <div class="flex justify-between items-center mt-1">
                <div class="h-3 bg-unicredit-gray-lighter rounded w-1/2"></div>
                <div class="h-4 bg-unicredit-gray-lighter rounded w-20"></div>
            </div>
        </div>
    </div>
  `
})
export class AnnouncementListSkeletonComponent { }
