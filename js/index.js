$(function () {
  const images = [
    "/images/banner1.svg",
    "/images/banner2.svg",
    "/images/banner3.svg",
  ];

  let current = 0;
  const bannerImg = $(".banner-img");
  const dots = $(".dot");
  let interval;

  function changeSlide(index) {
    current = index;
    bannerImg.fadeOut(400, function () {
      $(this).attr("src", images[current]).fadeIn(400);
    });
    dots.removeClass("active").eq(current).addClass("active");
  }

  function autoSlide() {
    interval = setInterval(() => {
      current = (current + 1) % images.length;
      changeSlide(current);
    }, 4000);
  }

  dots.on("click", function () {
    clearInterval(interval);
    const index = $(this).data("index");
    changeSlide(index);
    autoSlide();
  });

  autoSlide();

  // =======toggle type form=======
  $(".toggle-container").each(function () {
    let isOpen = false;
    const container = $(this);
    const toggleBtn = container.find(".toggle-btn");
    const trigger = toggleBtn.length ? toggleBtn : container;

    trigger.on("click", function (e) {
      e.stopPropagation();
      isOpen = !isOpen;

      const items = container.find(
        ".show-form-type:nth-child(1), .show-form-type:nth-child(2)"
      );
      const img = container.find(".toggle-btn img");

      if (isOpen) {
        items.css("display", "flex").addClass("show");
        img.attr("src", "/images/close.png");
      } else {
        items.removeClass("show");
        setTimeout(() => items.css("display", "none"), 300);
        img.attr("src", "/images/titan-gif.gif.svg");
      }
    });
  });

  let step = 1;
  const totalSteps = 6;

  function updateStep() {
    $(".application_form_container")
      .removeClass(
        "show-form-1 show-form-2 show-form-3 show-form-4 show-form-5 show-form-6"
      )
      .addClass("show-form-" + step);

    $(".breadcrumb .step").removeClass("active completed");
    $(".breadcrumb .step").each(function (index) {
      let s = index + 1;
      if (s < step) $(this).addClass("completed");
      if (s === step) $(this).addClass("active");
    });
  }

  // ✅ Validation function (skip form4)
  function validateCurrentForm() {
    let valid = true;

    // 🚫 Skip validation for form4
    if (step === 4) return true;

    const currentForm = $("#form" + step);

    currentForm.find("input, select").each(function () {
      const $el = $(this);
      const val = $el.val()?.trim() || "";
      const $parentInputBox = $el.closest(".content-input");

      if (val === "") {
        valid = false;
        // If inside .content-input → red border on parent box
        if ($parentInputBox.length) {
          $parentInputBox.css("border", "2px solid red");
          $el.css("border", "none"); // remove inner border for clean look
        } else {
          // No parent content-input → red border on input itself
          $el.css("border", "2px solid red");
        }
      } else {
        // Reset border styles
        if ($parentInputBox.length) {
          $parentInputBox.css("border", "1px solid #ccc");
        } else {
          $el.css("border", "1px solid #ccc");
        }
      }
    });

    if (!valid) {
      // 🔔 Soft fade message
      const msg = $(
        "<div class='temp-msg'><span>Please fill in all required fields</span></div>"
      );
      $("body").append(msg);
      msg
        .css({
          position: "fixed",
          top: "20px",
          width: "100%",
          textAlign: "center",
          fontSize: "18px",
          margin: "auto",
          background: "rgba(255,0,0,0.85)",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          zIndex: "9999",
        })
        .hide()
        .fadeIn(200);

      setTimeout(() => msg.fadeOut(500, () => msg.remove()), 1000);
    }

    return valid;
  }

  $(document).on("input change", "input, select", function () {
    const $el = $(this);
    const $parentInputBox = $el.closest(".content-input");

    if ($el.val().trim() !== "") {
      if ($parentInputBox.length) {
        $parentInputBox.css("border", "1px solid #ccc");
      } else {
        $el.css("border", "1px solid #ccc");
      }
    }
  });

  // ✅ Button handlers
  $(".next").on("click", function () {
    if (!validateCurrentForm()) return;

    if (step < totalSteps) {
      step++;
      updateStep();
    }
  });

  $(".prev").on("click", function () {
    if (step > 1) {
      step--;
      updateStep();
    }
  });

  $(".finish").on("click", function () {
    $("#successPopup").fadeIn(300).css("display", "flex");
    setTimeout(function () {
      $("#successPopup").fadeOut(300, function () {
        window.location.href = "dashboard.html";
      });
    }, 3000);
  });

  $("#closePopup").on("click", function () {
    $("#popup").removeClass("show");
  });

  updateStep();
  // Beneficiary Table
  let currentRows = 0;

  function addRow() {
    currentRows++;
    const rowHTML = `
      <div class="App-5-num">${currentRows}.</div>
      <div class="form-group"><input type="text" placeholder="សូមបំពេញ/Input Text"></div>
      <div class="form-group"><input type="text" placeholder="សូមបំពេញ/Input Text"></div>
      <div class="form-group"><input type="text" placeholder="សូមបំពេញ/Input Text"></div>
      <div class="form-group"><input type="text" placeholder="សូមបំពេញ/Input Text"></div>
    `;
    $("#table-body").append(rowHTML);
  }

  // Show 2 default rows
  addRow();
  addRow();
  $("#addRow").on("click", addRow);
  // delegated binding in case inputs are added dynamically
  $(document).on("change", ".fileUpload", function () {
    const file = this.files && this.files[0];
    // find the preview inside the same upload-box
    const $preview = $(this).closest(".upload-box").find(".preview");

    if (!file) {
      $preview.html("<span>Upload Preview</span>");
      return;
    }

    // file size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      $preview.html("<span>File too large (max 2MB)</span>");
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $preview.html(
          `<img src="${e.target.result}" alt="Uploaded Image" style="max-width:100%;height:auto;">`
        );
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other accepted non-image -> show filename
      $preview.html(`<span>${file.name}</span>`);
    }
  });

  // socail selection
  $(".dropdown").click(function (e) {
    e.stopPropagation();
    $(".menu").toggle();
  });
  $(".menu i").click(function () {
    let icon = $(this).attr("class"),
      color = $(this).css("color"),
      ph = $(this).data("val");
    $("#icon").attr("class", icon).css("color", color);
    $("#user").attr("placeholder", ph);
    $(".menu").hide();
  });
  $(document).click(() => $(".menu").hide());

  // active button yes no
  $(".flex-bt-quest div").on("click", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
  });

  // ===== Auto show main-quest ទី១ និង sub-question ទី១ =====
  var $firstBody = $(".App-4-body").first();
  $firstBody.slideDown(200);
  var $firstMain = $firstBody.find(".App-4-body-row-quest:first .main-quest");
  $firstMain.slideDown(200).addClass("show");
  var $firstSub = $firstMain.find(".sub-quest .sub-quest-content:first");
  if ($firstSub.length) {
    $firstMain.find(".sub-quest").first().slideDown(200).addClass("show");
    $firstSub.slideDown(200).addClass("show");
  } else {
    var $fg = $firstMain.find(".block-quest-answ .form-group").first();
    if ($fg.length) {
      $fg.slideDown(200).addClass("show");
    }
  }

  // ===== Toggle body when clicking image =====
  $(document).on("click", ".App-1-head-title img", function () {
    var $body = $(this).closest(".App-2-content").find(".App-4-body");
    $body.slideToggle(200);
    $(this).toggleClass("rotated");
  });

  // Toggle sub-quest (collapse/expand)
  $(document).on("click", ".main-quest-mark img", function () {
    var $main = $(this).closest(".main-quest");
    var $subContainer = $main.find(".sub-quest").first();

    if ($subContainer.length) {
      $subContainer.slideToggle(200);
      $(this).toggleClass("rotated");
    } else {
      var $fg = $main.find(".block-quest-answ .form-group").first();
      if ($fg.length) {
        if ($fg.is(":visible")) {
          $fg.slideUp(150).removeClass("show");
        } else {
          $fg.slideDown(150).addClass("show");
        }
        $(this).toggleClass("rotated");
      }
    }
  });

  // Yes/No logic
  $(document).on(
    "click",
    ".flex-bt-quest .bt-yes, .flex-bt-quest .bt-no",
    function () {
      var $btn = $(this);
      var $sub = $btn.closest(".sub-quest-content");
      var wrapperType = "sub";
      if (!$sub.length) {
        $sub = $btn.closest(".block-quest-answ");
        wrapperType = "block";
      }
      var $form = $sub.find(".form-group").first();
      $btn.addClass("active").siblings().removeClass("active");
      if ($btn.hasClass("bt-yes")) {
        if ($form.length) $form.slideDown(150).addClass("show");
      } else {
        if ($form.length) $form.slideUp(120).removeClass("show");
        if (wrapperType === "sub") {
          if (!$sub.hasClass("completed")) finishQuestion($sub);
        } else {
          if (!$sub.closest(".main-quest").hasClass("completed"))
            finishQuestion($sub);
        }
      }
    }
  );

  $(document).on("click", ".save-answ", function (e) {
    e.preventDefault();
    var $sub = $(this).closest(".sub-quest-content");
    if (!$sub.length) $sub = $(this).closest(".block-quest-answ");
    if (
      $sub.length &&
      !$sub.hasClass("completed") &&
      !$sub.closest(".main-quest").hasClass("completed")
    ) {
      finishQuestion($sub);
    }
  });

  function finishQuestion($subOrBlock) {
    if (!$subOrBlock || !$subOrBlock.length) return;
    if ($subOrBlock.hasClass("sub-quest-content")) {
      $subOrBlock.addClass("completed");
      var $nextSub = $subOrBlock.nextAll(".sub-quest-content").first();
      if ($nextSub.length) {
        $nextSub.slideDown(200).addClass("show");
      } else {
        var $main = $subOrBlock.closest(".main-quest");
        var $nextMain = $main
          .closest(".App-4-body-row-quest")
          .next()
          .find(".main-quest")
          .first();
        if ($nextMain.length) {
          $nextMain.slideDown(250).addClass("show");
          var $subContainer = $nextMain.find(".sub-quest").first();
          var $firstSub = $nextMain.find(".sub-quest .sub-quest-content:first");
          if ($subContainer.length && $firstSub.length) {
            $subContainer.slideDown(200);
            $firstSub.slideDown(200).addClass("show");
          } else {
            var $fg = $nextMain.find(".block-quest-answ .form-group").first();
            if ($fg.length) $fg.slideDown(200).addClass("show");
          }
        }
      }
    } else if ($subOrBlock.hasClass("block-quest-answ")) {
      var $main = $subOrBlock.closest(".main-quest");
      $main.addClass("completed");
      var $nextMain2 = $main
        .closest(".App-4-body-row-quest")
        .next()
        .find(".main-quest")
        .first();
      if ($nextMain2.length) {
        $nextMain2.slideDown(250).addClass("show");
        var $subContainer2 = $nextMain2.find(".sub-quest").first();
        var $firstSub2 = $nextMain2.find(".sub-quest .sub-quest-content:first");
        if ($subContainer2.length && $firstSub2.length) {
          $subContainer2.slideDown(200);
          $firstSub2.slideDown(200).addClass("show");
        } else {
          var $fg2 = $nextMain2.find(".block-quest-answ .form-group").first();
          if ($fg2.length) $fg2.slideDown(200).addClass("show");
        }
      }
    }
  }

  // === PROPOSAL FLOW ===
  const $sections = $(
    ".proposal-block-section-1, .proposal-block-section-2, .proposal-block-section-3, .proposal-block-section-4"
  );
  let i = 0;

  // Hide all except the first
  $sections.hide().eq(0).show();

  function show(idx) {
    if (idx === i || idx < 0 || idx >= $sections.length) return;

    const $cur = $sections.eq(i);
    const $next = $sections.eq(idx);

    // Safe animations
    $cur.stop(true, true).slideUp(250);
    $next.stop(true, true).slideDown(250);

    i = idx;
  }

  // === VALIDATION FUNCTION ===
  function validateCurrentSection() {
    let valid = true;
    const $current = $sections.eq(i);

    $current.find("input, select").each(function () {
      const $el = $(this);
      const val = $el.val()?.trim() || "";
      const $parentInputBox = $el.closest(".content-input");

      if (val === "") {
        valid = false;
        // 🔴 Red border rule
        if ($parentInputBox.length) {
          $parentInputBox.css("border", "2px solid red");
          $el.css("border", "none");
        } else {
          $el.css("border", "2px solid red");
        }
      } else {
        // ✅ Reset border
        if ($parentInputBox.length) {
          $parentInputBox.css("border", "1px solid #ccc");
        } else {
          $el.css("border", "1px solid #ccc");
        }
      }
    });

    if (!valid) {
      // Show soft fade message
      const msg = $(
        "<div class='temp-msg'>Please fill in all required fields</div>"
      );
      $("body").append(msg);
      msg
        .css({
          position: "fixed",
          top: "20px",
          width: "100%",
          textAlign: "center",
          fontSize: "18px",
          margin: "auto",
          background: "rgba(255,0,0,0.85)",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          zIndex: "9999",
        })
        .hide()
        .fadeIn(200);

      setTimeout(() => msg.fadeOut(500, () => msg.remove()), 1000);
    }

    return valid;
  }

  // === NEXT BUTTON ===
  $(document).on("click", ".next", function () {
    if (!validateCurrentSection()) return; // 🛑 stop if invalid
    const target = +$(this).data("next") - 1;
    show(Math.min(target, $sections.length - 1));
  });

  // === BACK BUTTON ===
  $(document).on("click", ".back", function () {
    const target = +$(this).data("back") - 1 || i - 1;
    show(Math.max(target, 0));
  });

  // === SUBMIT BUTTON ===
  $(document).on("click", ".submit", function () {
    if (!validateCurrentSection()) return; // ✅ validate before submit
    alert("Submitted!");
  });

  // === LIVE BORDER RESET ===
  $(document).on("input change", "input, select", function () {
    const $el = $(this);
    const $parentInputBox = $el.closest(".content-input");

    if ($el.val().trim() !== "") {
      if ($parentInputBox.length) {
        $parentInputBox.css("border", "1px solid #ccc");
      } else {
        $el.css("border", "1px solid #ccc");
      }
    }
  });

  // === Dynamic table row show by Premium Paying Term ===
  $(document).on("change", "select#premium-term", function () {
    const selected = parseInt($(this).val(), 10);
    const $rows = $(".proposal-block-section-2 .table-container tbody tr");
    $rows.hide(); // hide all first
    $rows.slice(0, selected).show(); // show only N rows
  });

  // Open modal
  $(".sign-out").on("click", function () {
    $("#signoutModal").fadeIn(200).css("display", "flex");
  });

  // Close modal
  $("#cancelSignOut").on("click", function () {
    $("#signoutModal").fadeOut(200);
  });

  // Confirm sign out
  $("#confirmSignOut").on("click", function () {
    $("#signoutModal").fadeOut(200);
    // Example redirect or message
    window.location.href = "home.html";
    // Uncomment to redirect:
    // window.location.href = "login.html";
  });

  // Optional: close modal when clicking outside the box
  $(document).on("click", function (e) {
    if ($(e.target).is("#signoutModal")) {
      $("#signoutModal").fadeOut(200);
    }
  });

  $(".member-login").click(() => $(".profile-popup").fadeToggle(200));
  $(".close,body").click((e) => {
    if (!$(e.target).closest(".profile-popup,.member-login").length)
      $(".profile-popup").fadeOut(200);
  });
  $(".close-btn").click(() => {
    $(".profile-popup").fadeOut(200);
  });

  // Show Renewal Popup
  $(".renewal-btn").on("click", function () {
    $("#renewalPopup").fadeIn(200).css("display", "flex");
  });

  // Confirm Renewal
  $("#confirmRenewal").on("click", function () {
    alert("Renewal confirmed!");
    $("#renewalPopup").fadeOut(200);
  });

  // Cancel Renewal
  $("#cancelRenewal").on("click", function () {
    $("#renewalPopup").fadeOut(200);
  });

  // Click outside to close
  $(document).on("click", function (e) {
    if ($(e.target).is("#renewalPopup")) {
      $("#renewalPopup").fadeOut(200);
    }
  });

  // When clicking any "View" button
  $(".btn:contains('View')").on("click", function () {
    $("#policyModal").fadeIn(200).css("display", "flex");
  });

  // Close modal
  $("#closePolicy").on("click", function () {
    $("#policyModal").fadeOut(200);
  });
  // When clicking the Submit button
  $(".submit-btn button").on("click", function (e) {
    e.preventDefault(); // prevent form reload if inside <form>

    // Show popup
    $("#passwordPopup").fadeIn(300).css("display", "flex");

    // Hide popup after 3 seconds
    setTimeout(function () {
      $("#passwordPopup").fadeOut(300);
    }, 3000);
  });
  // Close when clicking outside box
  $(document).on("click", function (e) {
    if ($(e.target).is("#policyModal")) {
      $("#policyModal").fadeOut(200);
    }
  });

  // fill age
  $("#dob").on("change", function () {
    const dob = new Date($(this).val());
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    $("#age").val(age >= 0 ? age : "");
  });

  // === Dummy Data ===
  {
    const data = [];
    for (let i = 1; i <= 41; i++) {
      data.push({
        no: 1100,
        policy: "20250921A0" + (i < 10 ? "0" + i : i),
        insured: "-",
        insurance: "-",
        premiums: "-",
        payment: "-",
        period: "-",
        businessRate: "-",
        businessCom: "-",
        salesperson: "-",
        referralRate: "-",
        referralAmt: "-",
        referral: "-",
        payDate: "-",
        settleDate: "-",
        enrollDate: "-",
        category: "-",
      });
    }

    const rowsPerPage = 15;
    let currentPage = 1;

    function renderTable(filteredData) {
      const tbody = $("#policyTable tbody");
      tbody.empty();

      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const pageData = filteredData.slice(start, end);

      pageData.forEach((d) => {
        tbody.append(`
          <tr>
            <td>${d.no}</td>
            <td>${d.policy}</td>
            <td>${d.insured}</td>
            <td>${d.insurance}</td>
            <td>${d.premiums}</td>
            <td>${d.payment}</td>
            <td>${d.period}</td>
            <td>${d.businessRate}</td>
            <td>${d.businessCom}</td>
            <td>${d.salesperson}</td>
            <td>${d.referralRate}</td>
            <td>${d.referralAmt}</td>
            <td>${d.referral}</td>
            <td>${d.payDate}</td>
            <td>${d.settleDate}</td>
            <td>${d.enrollDate}</td>
            <td>${d.category}</td>
          </tr>
        `);
      });

      $("#totalNum").text(filteredData.length);
      $("#startNum").text(start + 1);
      $("#endNum").text(Math.min(end, filteredData.length));
    }

    function renderPagination(filteredData) {
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);
      const pagination = $(".pagination");
      pagination.empty();

      pagination.append(`<button class="prev">&lt;</button>`);
      for (let i = 1; i <= totalPages; i++) {
        pagination.append(
          `<button class="page-btn ${
            i === currentPage ? "active" : ""
          }">${i}</button>`
        );
      }
      pagination.append(`<button class="next">&gt;</button>`);

      $(".page-btn")
        .off("click")
        .on("click", function () {
          currentPage = parseInt($(this).text());
          renderTable(filteredData);
          renderPagination(filteredData);
        });

      $(".prev")
        .off("click")
        .on("click", function () {
          if (currentPage > 1) {
            currentPage--;
            renderTable(filteredData);
            renderPagination(filteredData);
          }
        });

      $(".next")
        .off("click")
        .on("click", function () {
          if (currentPage < totalPages) {
            currentPage++;
            renderTable(filteredData);
            renderPagination(filteredData);
          }
        });
    }

    function filterData() {
      const nameVal = $("#search-name").val().toLowerCase();
      const policyVal = $("#search-policy").val().toLowerCase();
      const phoneVal = $("#search-phone").val().toLowerCase();

      return data.filter(
        (d) =>
          d.policy.toLowerCase().includes(policyVal) &&
          d.insured.toLowerCase().includes(nameVal) &&
          d.salesperson.toLowerCase().includes(phoneVal)
      );
    }

    function updateView() {
      const filtered = filterData();
      currentPage = 1;
      renderTable(filtered);
      renderPagination(filtered);
    }

    $("#search-name, #search-policy, #search-phone").on("keyup", updateView);
    updateView();
  }
});
