import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterOptions } from '@/app/core/models';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private initialFilters: FilterOptions = {
        companies: [],
        members: [],
        dateRange: { from: undefined, to: undefined },
        unread: false,
        todo: false,
        attachments: false
    };

    private activeFiltersSubject = new BehaviorSubject<FilterOptions>(this.initialFilters);
    activeFilters$ = this.activeFiltersSubject.asObservable();

    constructor() { }

    get activeFilters(): FilterOptions {
        return this.activeFiltersSubject.value;
    }

    updateFilters(filters: FilterOptions) {
        this.activeFiltersSubject.next(filters);
    }

    clearFilters() {
        this.activeFiltersSubject.next({ ...this.initialFilters });
    }

    get activeFilterCount(): number {
        const filters = this.activeFilters;
        let count = 0;
        if (filters.companies.length > 0) count++;
        if (filters.members.length > 0) count++;
        if (filters.dateRange.from || filters.dateRange.to) count++;
        if (filters.unread) count++;
        if (filters.todo) count++;
        if (filters.attachments) count++;
        return count;
    }
}
