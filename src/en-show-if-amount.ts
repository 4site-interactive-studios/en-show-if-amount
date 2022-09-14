export class EnShowIfAmount {
  private _elements: NodeListOf<HTMLElement>;
  private _frequencyList = {
    ONETIME: "onetime",
    MONTHLY: "monthly",
    QUARTERLY: "quarterly",
    SEMI_ANNUAL: "semiannual",
    ANNUAL: "annual",
  };
  constructor() {
    this.log("EN Show If Amount: Debug mode is on");
    if (!this.shouldRun()) {
      this.log("EN Show If Amount Not Running");
      return;
    }
    this.run();
  }

  private shouldRun(): boolean {
    return !!this.getPageId();
  }
  private getPageId() {
    if ("pageJson" in window) return (window as any)?.pageJson?.campaignPageId;
    return 0;
  }

  private isDebug() {
    const regex = new RegExp("[\\?&]debug=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  private run() {
    this.log("EN Show If Amount Running");
    while (
      !this.checkNested(
        (window as any).EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "getDonationTotal"
      )
    ) {
      this.log("EN Show If Amount: Waiting for EngagingNetworks");
      window.setTimeout(() => {
        this.run();
      }, 10);
      return;
    }
    this.log("EN Show If Amount: EngagingNetworks is ready");
    this._elements = document.querySelectorAll('[class*="showifamount"]');
    this.setAmount(this.getENAmount());
    this.setFrequency(this.getFrequency());
    this.addEvents();
    this.checkElements();
  }
  private checkElements() {
    const amount = this.getAmount();
    const frequency = this.getFrequency();
    this._elements.forEach((element) => {
      if (this.checkFrequency(frequency, element)) {
        this.lessthan(amount, element);
        this.lessthanorequalto(amount, element);
        this.equalto(amount, element);
        this.greaterthanorequalto(amount, element);
        this.greaterthan(amount, element);
        this.between(amount, element);
      }
    });
  }

  private addEvents() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          this.checkElements();
        }
      });
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-en-amount", "data-en-frequency"],
    });
    const radios = "transaction.donationAmt";
    const other = "transaction.donationAmt.other";
    // Watch Radios Inputs for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element) {
        if (element.name === radios || element.name === other) {
          this.setAmount(this.getENAmount());
        }
      }
    });
    // Watch Other Amount Field
    const otherField = document.querySelector(
      `[name='${other}']`
    ) as HTMLInputElement;
    if (otherField) {
      otherField.addEventListener("keyup", () => {
        this.setAmount(this.getENAmount());
      });
    }
    // Range Slider Compatability
    const rangeInput = document.querySelector(
      ".en-range-slider__range-input"
    ) as HTMLInputElement;
    const formAmountInput = document.querySelector(
      ".en-range-slider__form-amount-input"
    ) as HTMLInputElement;
    if (rangeInput) {
      rangeInput.addEventListener("input", () => {
        this.setAmount(this.getENAmount());
      });
    }
    if (formAmountInput) {
      formAmountInput.addEventListener("input", () => {
        this.setAmount(parseFloat(formAmountInput.value));
      });
      formAmountInput.addEventListener("keydown", () => {
        this.setAmount(parseFloat(formAmountInput.value));
      });
    }
    const frequency = document.querySelectorAll(
      "[name='transaction.recurrfreq']"
    ) as NodeListOf<HTMLInputElement>;
    frequency.forEach((element) => {
      element.addEventListener("change", () => {
        this.setFrequency(element.value);
      });
    });
  }

  private log(message: string | object) {
    if (this.isDebug()) {
      let messageString = message;
      if (typeof message === "object") {
        messageString = JSON.stringify(message);
      }

      console.log(
        `%c${messageString}`,
        "color: white; background: orange; font-size: 1.2rem; font-weight: bold; padding: 2px; border-radius: 2px;"
      );
    }
  }
  private checkNested(obj: any, ...args: string[]) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !Object.getOwnPropertyDescriptor(obj, args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }
  private setFrequency(frequency: string) {
    const freq =
      this._frequencyList[
        frequency.toUpperCase() as keyof typeof this._frequencyList
      ] || "onetime";
    // Add the frequency to the body data attribute
    this.log(`EN Show If Amount: Setting frequency to ${freq}`);
    document.body.setAttribute("data-en-frequency", freq);
  }
  private setAmount(amount: number) {
    // Add the amount to the body data attribute
    this.log(`EN Show If Amount: Setting amount to ${amount}`);
    document.body.setAttribute("data-en-amount", amount.toString());
  }
  private getAmount(): number {
    const amount = parseFloat(
      document.body.getAttribute("data-en-amount") || "0"
    );
    return isNaN(amount) ? 0 : amount;
  }
  private getENAmount(): number {
    return (
      window as any
    ).EngagingNetworks.require._defined.enjs.getDonationTotal();
  }
  private getFrequency(): string {
    const frequency = (
      window as any
    ).EngagingNetworks.require._defined.enjs.getFieldValue(
      "recurrfreq"
    ) as keyof typeof this._frequencyList;
    return this._frequencyList[frequency] || "onetime";
  }

  private getClassNameByOperand(
    classList: DOMTokenList,
    operand: string
  ): string | null {
    let myClass = null;
    classList.forEach((className: string) => {
      if (className.includes(`showifamount-${operand}-`)) {
        myClass = className;
      }
    });
    return myClass;
  }
  private lessthan(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "lessthan"
    );
    if (showifamountClass) {
      const amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount < Number(amountCheck)) {
        this.log(
          `(lessthan): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private lessthanorequalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "lessthanorequalto"
    );
    if (showifamountClass) {
      const amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount <= Number(amountCheck)) {
        this.log(
          `(lessthanorequalto): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private equalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "equalto"
    );
    if (showifamountClass) {
      const amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount == Number(amountCheck)) {
        this.log(
          `(equalto): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private greaterthanorequalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "greaterthanorequalto"
    );
    if (showifamountClass) {
      const amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount >= Number(amountCheck)) {
        this.log(
          `(greaterthanorequalto): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private greaterthan(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "greaterthan"
    );
    if (showifamountClass) {
      const amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount > Number(amountCheck)) {
        this.log(
          `(greaterthan): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private between(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "between"
    );
    if (showifamountClass) {
      const amountCheckMin = showifamountClass.split("-").slice(-2, -1)[0];
      const amountCheckMax = showifamountClass.split("-").slice(-1)[0];
      if (amount >= Number(amountCheckMin) && amount < Number(amountCheckMax)) {
        this.log(
          `(between): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
      } else {
        element.classList.remove("en-open");
      }
    }
  }
  private checkFrequency(frequency: string, element: HTMLElement): boolean {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "frequency"
    );
    if (showifamountClass) {
      const frequencyCheck = showifamountClass.split("-").slice(-1)[0];
      if (frequency === frequencyCheck) {
        this.log(
          `(frequency): Showing ${element.tagName} with class ${showifamountClass}`
        );
        element.classList.add("en-open");
        return true;
      } else {
        element.classList.remove("en-open");
        return false;
      }
    }
    return true;
  }
}
