// ======= HAMBURGER MENU FOR MOBILE =======
$(function () {
  const hamburgerMenu = $("#hamburgerMenu");
  const menuContent = $("#menuContent");
  const menuOverlay = $("#menuOverlay");
  const productMenu = $(".product-menu");

  // Toggle mobile menu
  hamburgerMenu.on("click", function () {
    $(this).toggleClass("active");
    menuContent.toggleClass("active");
    menuOverlay.toggleClass("active");
    $("body").toggleClass("menu-open");
  });

  // Close menu when clicking overlay
  menuOverlay.on("click", function () {
    hamburgerMenu.removeClass("active");
    menuContent.removeClass("active");
    menuOverlay.removeClass("active");
    $("body").removeClass("menu-open");
  });

  // Close menu when clicking any menu link
  menuContent.find("a").on("click", function (e) {
    // Don't close if clicking the product menu label itself
    if (!$(this).parent().hasClass("product-menu")) {
      hamburgerMenu.removeClass("active");
      menuContent.removeClass("active");
      menuOverlay.removeClass("active");
      $("body").removeClass("menu-open");
      productMenu.removeClass("active");
    }
  });

  // Close menu when clicking product dropdown links
  productMenu.find(".dropdown-product a").on("click", function () {
    hamburgerMenu.removeClass("active");
    menuContent.removeClass("active");
    menuOverlay.removeClass("active");
    $("body").removeClass("menu-open");
    productMenu.removeClass("active");
  });

  // Toggle product dropdown in mobile menu
  productMenu.find(".menu-label").on("click", function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      productMenu.toggleClass("active");
    }
  });

  // Close menu on window resize if desktop
  $(window).on("resize", function () {
    if (window.innerWidth > 768) {
      hamburgerMenu.removeClass("active");
      menuContent.removeClass("active");
      menuOverlay.removeClass("active");
      $("body").removeClass("menu-open");
      productMenu.removeClass("active");
    }
  });

  // Prevent body scroll when menu is open
  $("body").on("menu-open", function () {
    if ($("body").hasClass("menu-open")) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "");
    }
  });
});
