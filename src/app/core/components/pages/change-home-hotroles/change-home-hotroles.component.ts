import { HotRoles } from 'src/app/core/models/hot-roles.model';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray , CdkDrag , CdkDragMove } from '@angular/cdk/drag-drop';
import { startWith , map , switchMap , tap } from 'rxjs/operators';
import { merge , Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
  
const speed = 10;
declare var jQuery:any;

@Component({
  selector: 'app-change-home-hotroles',
  templateUrl: './change-home-hotroles.component.html',
  styleUrls: ['./change-home-hotroles.component.scss']
})

export class ChangeHomeHotrolesComponent implements AfterViewInit,OnDestroy {
  @Input() availableRoles;
  @Input() hotRoles;

  @ViewChild('myModal') myModal:ElementRef;

  @ViewChild('scrollEl')
  scrollEl:ElementRef<HTMLElement>;

  @ViewChildren(CdkDrag)
  dragEls:QueryList<CdkDrag>;

  subs = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private jobService: JobService,
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewInit(){
    const onMove$ = this.dragEls.changes.pipe(
    startWith(this.dragEls)
    , map((d: QueryList<CdkDrag>) => d.toArray())
    , map(dragels => dragels.map(drag => drag.moved))
    , switchMap(obs => merge(...obs))
    , tap(this.triggerScroll)
  );

  this.subs.add(onMove$.subscribe());

  const onDown$ = this.dragEls.changes.pipe(
        startWith(this.dragEls)
        , map((d: QueryList<CdkDrag>) => d.toArray())
        , map(dragels => dragels.map(drag => drag.ended))
        , switchMap(obs => merge(...obs))
        , tap(this.cancelScroll)
    );

    this.subs.add(onDown$.subscribe());
  }

  private animationFrame: number | undefined;

  @bound
  public triggerScroll($event: CdkDragMove) {
      if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
          this.animationFrame = undefined;
      }
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
  }

  @bound
  private cancelScroll() {
      if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
          this.animationFrame = undefined;
      }
  }

  private scroll($event: CdkDragMove) {
      const { y } = $event.pointerPosition;
      const baseEl = this.scrollEl.nativeElement;
      const box = baseEl.getBoundingClientRect();
      const scrollTop = baseEl.scrollTop;
      const top = box.top + - y ;
      if (top > 0 && scrollTop !== 0) {
          const newScroll = scrollTop - speed * Math.exp(top / 50);
          baseEl.scrollTop = newScroll;
          this.animationFrame = requestAnimationFrame(() => this.scroll($event));
          return;
      }

      const bottom = y - box.bottom ;
      if (bottom > 0 && scrollTop < box.bottom) {
          const newScroll = scrollTop + speed * Math.exp(bottom / 50);
          baseEl.scrollTop = newScroll;
          this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      }
  }


  onDrop(event: CdkDragDrop<string[]>) {
    let indexPreviousContainer = Number(event.previousContainer.id.slice(-1)) - 1;
    if (isNaN(Number(event.previousContainer.id.slice(-3)))) {
      indexPreviousContainer = Number(event.previousContainer.id.slice(-1)) - 1;
    } else {
      indexPreviousContainer = Number(event.previousContainer.id.slice(-2)) - 1;
    }
    let indexContainer = Number(event.container.id.slice(-1)) - 1;
    if (isNaN(Number(event.container.id.slice(-3)))) {
      indexContainer = Number(event.container.id.slice(-1)) - 1;
    } else {
      indexContainer = Number(event.container.id.slice(-2)) - 1;
    }
    if (event.previousContainer === event.container) {
      if (event.previousContainer.id === 'cdk-drop-list-0' && event.container.id === 'cdk-drop-list-0') {
        moveItemInArray(this.availableRoles, event.previousIndex, event.currentIndex);
      }
    } else if (event.previousContainer.id !== 'cdk-drop-list-0' && event.container.id !== 'cdk-drop-list-0') {
      if (this.hotRoles[indexPreviousContainer].id !== null && 
          this.hotRoles[indexPreviousContainer].name !== null && 
          this.hotRoles[indexContainer].id !== null &&
          this.hotRoles[indexContainer].name !== null) {
        let tempId1 = this.hotRoles[indexPreviousContainer].id;
        let tempId2 = this.hotRoles[indexContainer].id;
        let tempName1 = this.hotRoles[indexPreviousContainer].name;
        let tempName2 = this.hotRoles[indexContainer].name;
        this.hotRoles[indexContainer].id = tempId1;
        this.hotRoles[indexContainer].name = tempName1;
        this.hotRoles[indexPreviousContainer].id = tempId2;
        this.hotRoles[indexPreviousContainer].name = tempName2;
      } else if (this.hotRoles[indexPreviousContainer].id !== null && 
                 this.hotRoles[indexPreviousContainer].name !== null && 
                 this.hotRoles[indexContainer].id === null &&
                 this.hotRoles[indexContainer].name === null) {
        this.hotRoles[indexContainer].id = this.hotRoles[indexPreviousContainer].id;
        this.hotRoles[indexContainer].name = this.hotRoles[indexPreviousContainer].name;
        this.hotRoles[indexPreviousContainer].id = null;
        this.hotRoles[indexPreviousContainer].name = null;
      } else if (this.hotRoles[indexPreviousContainer].id === null && 
                 this.hotRoles[indexPreviousContainer].name === null && 
                 this.hotRoles[indexContainer].id !== null &&
                 this.hotRoles[indexContainer].name !== null) {
        this.hotRoles[indexPreviousContainer].id = this.hotRoles[indexContainer].id;
        this.hotRoles[indexPreviousContainer].name = this.hotRoles[indexContainer].name;
        this.hotRoles[indexContainer].id = null;
        this.hotRoles[indexContainer].name = null;
      }
      if (this.hotRoles[indexPreviousContainer].id !== null) {
        this.changeHotRolesStatus(this.hotRoles[indexPreviousContainer].id, "TRUE", indexPreviousContainer);
      }
      this.changeHotRolesStatus(this.hotRoles[indexContainer].id, "TRUE", indexContainer);
    } else if (event.previousContainer.id !== 'cdk-drop-list-0' && event.container.id === 'cdk-drop-list-0') {
      this.changeHotRolesStatus(this.hotRoles[indexPreviousContainer].id, "FALSE", -1);
      this.availableRoles.push(new HotRoles(this.hotRoles[indexPreviousContainer].id, this.hotRoles[indexPreviousContainer].name, this.hotRoles[indexPreviousContainer].index));
      this.hotRoles[indexPreviousContainer].id = null;
      this.hotRoles[indexPreviousContainer].name = null;
    } else if (event.previousContainer.id === 'cdk-drop-list-0' && event.container.id !== 'cdk-drop-list-0') {
      if (this.hotRoles[indexContainer].id !== null && this.hotRoles[indexContainer].name !== null) {
        this.availableRoles.push(new HotRoles(this.hotRoles[indexContainer].id, this.hotRoles[indexContainer].name, this.hotRoles[indexContainer].index));
      }
      this.hotRoles[indexContainer].id = this.availableRoles[event.previousIndex].id;
      this.hotRoles[indexContainer].name = this.availableRoles[event.previousIndex].name;
      this.availableRoles.splice(event.previousIndex, 1);
      this.changeHotRolesStatus(this.hotRoles[indexContainer].id, "TRUE", indexContainer);
    }
  }

  onClickRemove(index: number) {
    this.availableRoles.push(new HotRoles(this.hotRoles[index].id, this.hotRoles[index].name, this.hotRoles[index].index));
    this.hotRoles[index].id = null;
    this.hotRoles[index].name = null;
  }

  changeHotRolesStatus(jobID, hotRole, hotRoleIndex) {
    // console.log(hotRole);
    this.jobService.changeHotRole(
        {
          'jobID': jobID,
          'hotRole': hotRole,
          'hotRoleIndex': hotRoleIndex
        }
      )
      .subscribe(response => {
        // console.log(response);
      });
  }
}

export function bound(target: Object, propKey: string | symbol) {
  var originalMethod = (target as any)[propKey] as Function;

  // Ensure the above type-assertion is valid at runtime.
  if (typeof originalMethod !== "function") throw new TypeError("@bound can only be used on methods.");

  if (typeof target === "function") {
      // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
      return {
          value: function () {
              return originalMethod.apply(target, arguments);
          }
      };
  } else if (typeof target === "object") {
      // Instance method, bind to instance on first invocation (as that is the only way to access an instance from a decorator).
      return {
          get: function () {
              // Create bound override on object instance. This will hide the original method on the prototype, and instead yield a bound version from the
              // instance itself. The original method will no longer be accessible. Inside a getter, 'this' will refer to the instance.
              var instance = this;

              Object.defineProperty(instance, propKey.toString(), {
                  value: function () {
                      // This is effectively a lightweight bind() that skips many (here unnecessary) checks found in native implementations.
                      return originalMethod.apply(instance, arguments);
                  }
              });

              // The first invocation (per instance) will return the bound method from here. Subsequent calls will never reach this point, due to the way
              // JavaScript runtimes look up properties on objects; the bound method, defined on the instance, will effectively hide it.
              return instance[propKey];
          }
      } as PropertyDescriptor;
  }
}