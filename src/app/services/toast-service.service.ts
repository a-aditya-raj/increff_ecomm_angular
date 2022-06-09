import { Injectable } from "@angular/core";

export interface ToastData {
  header: string;
  message: string;
  type: "success" | "error";
}

@Injectable()
export class ToastService {
  timeoutID: any;

  initializeToast(autohide: boolean = false) {
    this.removeToast();
    if (!autohide)
      this.timeoutID = setTimeout(this.removeToast.bind(this), 5000);
  }

  showToast(message: string, header: string, type: string) {
    this.initializeToast(type === "error");

    const toaster =
      `
    <div class="toast m-2 ml-auto  ` +
      type +
      ` ">
        <div class="toast-header border-bottom">
            <strong class="mr-auto">` +
      header +
      `</strong>
        <button type="button" class="ml-2 close" id="toast-button">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="toast-body">
            ` +
      message +
      `
        </div>
    </div>`;

    // Attaching the message toasts dynamically
    const toast = $(".toaster").append(toaster);

    toast.find(`#toast-button`).on("click", () => this.removeToast());
    $(".toast").addClass("show");
  }

  removeToast() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
    $(`.toast`).remove();
  }

  success(message: string, header: string = "Success") {
    this.showToast(message, header, "success");
  }

  error(message: string, header: string = "Error") {
    this.showToast(message, header, "error");
  }
}