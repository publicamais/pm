/*!
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This file should be included in all pages
 !**/

$(function() {
	"use strict";

	//Enable sidebar toggle
	$("[data-toggle='offcanvas']").click(function(e) {
		e.preventDefault();

		//If window is small enough, enable sidebar push menu
		if ($(window).width() <= 992) {
			$('.row-offcanvas').toggleClass('active');
			$('.left-side').removeClass("collapse-left");
			$(".right-side").removeClass("stretch");
			$('.row-offcanvas').toggleClass("relative");
		} else {
			//Else, enable content stretching
			$('.left-side').toggleClass("collapse-left");
			$(".right-side").toggleClass("stretch");
		}
	});

	//Add hover support for touch devices
	$('.btn').bind('touchstart', function() {
		$(this).addClass('hover');
	}).bind('touchend', function() {
		$(this).removeClass('hover');
	});

	//Activate tooltips
	$("[data-toggle='tooltip']").tooltip();

	/*
	 * Add collapse and remove events to boxes
	 */
	$("[data-widget='collapse']").click(function() {
		//Find the box parent
		var box = $(this).parents(".box").first();
		//Find the body and the footer
		var bf = box.find(".box-body, .box-footer");
		if (!box.hasClass("collapsed-box")) {
			box.addClass("collapsed-box");
			bf.slideUp();
		} else {
			box.removeClass("collapsed-box");
			bf.slideDown();
		}
	});

	/*
	 * INITIALIZE BUTTON TOGGLE
	 * ------------------------
	 */
	$('.btn-group[data-toggle="btn-toggle"]').each(function() {
		var group = $(this);
		$(this).find(".btn").click(function(e) {
			group.find(".btn.active").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});

	});

	$("[data-widget='remove']").click(function() {
		//Find the box parent
		var box = $(this).parents(".box").first();
		box.slideUp();
	});

	/* Sidebar tree view */
	$(".sidebar .treeview").tree();

	/*
	* Make sure that the sidebar is stretched full height
	* ---------------------------------------------
	* We are gonna assign a min-height value every time the
	* wrapper gets resized and upon page load. We will use
	* Ben Alman's method for detecting the resize event.
	**/
	//alert($(window).height());
	function _fix() {
		//Get window height and the wrapper height
		var height = $(window).height() - $("body > .header").height();
		$(".wrapper").css("min-height", height + "px");
		var content = $(".wrapper").height();
		//If the wrapper height is greater than the window
		if (content > height)
			//then set sidebar height to the wrapper
			$(".left-side, html, body").css("min-height", content + "px");
		else {
			//Otherwise, set the sidebar to the height of the window
			$(".left-side, html, body").css("min-height", height + "px");
		}
	}

	//Fire upon load
	_fix();
	//Fire when wrapper is resized
	$(".wrapper").resize(function() {
		_fix();
	});
});

/*
 * SIDEBAR MENU
 * ------------
 * This is a custom plugin for the sidebar menu. It provides a tree view.
 *
 * Usage:
 * $(".sidebar).tree();
 *
 * Note: This plugin does not accept any options. Instead, it only requires a class
 *       added to the element that contains a sub-menu.
 *
 * When used with the sidebar, for example, it would look something like this:
 * <ul class='sidebar-menu'>
 *      <li class="treeview active">
 *          <a href="#>Menu</a>
 *          <ul class='treeview-menu'>
 *              <li class='active'><a href=#>Level 1</a></li>
 *          </ul>
 *      </li>
 * </ul>
 *
 * Add .active class to <li> elements if you want the menu to be open automatically
 * on page load. See above for an example.
 */
( function($) {
		"use strict";

		$.fn.tree = function() {

			return this.each(function() {
				var btn = $(this).children("a").first();
				var menu = $(this).children(".treeview-menu").first();
				var isActive = $(this).hasClass('active');

				//initialize already active menus
				if (isActive) {
					menu.show();
					btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
				}
				//Slide open or close the menu on link click
				btn.click(function(e) {
					e.preventDefault();
					if (isActive) {
						//Slide up to close menu
						menu.slideUp();
						isActive = false;
						btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
						btn.parent("li").removeClass("active");
					} else {
						//Slide down to open menu
						menu.slideDown();
						isActive = true;
						btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
						btn.parent("li").addClass("active");
					}
				});

				/* Add margins to submenu elements to give it a tree look */
				menu.find("li > a").each(function() {
					var pad = parseInt($(this).css("margin-left")) + 10;

					$(this).css({
						"margin-left" : pad + "px"
					});
				});

			});

		};

	}(jQuery));

/* CENTER ELEMENTS */
( function($) {
		"use strict";
		jQuery.fn.center = function(parent) {
			if (parent) {
				parent = this.parent();
			} else {
				parent = window;
			}
			this.css({
				"position" : "absolute",
				"top" : ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
				"left" : ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
			});
			return this;
		}
	}(jQuery));

/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, h, c) {
	var a = $([]),
	    e = $.resize = $.extend($.resize, {}),
	    i,
	    k = "setTimeout",
	    j = "resize",
	    d = j + "-special-event",
	    b = "delay",
	    f = "throttleWindow";
	e[b] = 250;
	e[f] = true;
	$.event.special[j] = {
		setup : function() {
			if (!e[f] && this[k]) {
				return false;
			}
			var l = $(this);
			a = a.add(l);
			$.data(this, d, {
				w : l.width(),
				h : l.height()
			});
			if (a.length === 1) {
				g();
			}
		},
		teardown : function() {
			if (!e[f] && this[k]) {
				return false
			}
			var l = $(this);
			a = a.not(l);
			l.removeData(d);
			if (!a.length) {
				clearTimeout(i);
			}
		},
		add : function(l) {
			if (!e[f] && this[k]) {
				return false
			}
			var n;
			function m(s, o, p) {
				var q = $(this),
				    r = $.data(this, d);
				r.w = o !== c ? o : q.width();
				r.h = p !== c ? p : q.height();
				n.apply(this, arguments)
			}

			if ($.isFunction(l)) {
				n = l;
				return m
			} else {
				n = l.handler;
				l.handler = m
			}
		}
	};
	function g() {
		i = h[k](function() {
			a.each(function() {
				var n = $(this),
				    m = n.width(),
				    l = n.height(),
				    o = $.data(this, d);
				if (m !== o.w || l !== o.h) {
					n.trigger(j, [o.w = m, o.h = l])
				}
			});
			g()
		}, e[b])
	}

}
)(jQuery, this);

function alerta(texto, tipo) {
	noty({
		text : texto,
		type : tipo,
		theme : 'relax',
		dismissQueue : true,
		layout : "topCenter",
		timeout : true,
		killer : true,
		animation : {
			open : 'animated flipInX',
			close : 'animated flipOutX'
		},
		callback : {
			afterShow : function(a) {
				$(this).remove();
			}
		}
	});
	return false;
}

function copiar(texto) {
	var aux = document.createElement("input");
	aux.setAttribute("value", texto);
	document.body.appendChild(aux);
	aux.select();
	document.execCommand("copy");
	document.body.removeChild(aux);
}

function moeda(z) {
	v = z.value;
	v = v.replace(/\D/g, "");
	v = v.replace(/(\d{1})(\d{1,2})$/, "$1.$2")
	z.value = v;
}

function mudarSenha() {
	var senhaantiga = $("#senhaAntiga").val();
	var senhanova = $("#senhaNova").val();

	if (senhaantiga && senhanova) {
		$.post("ajax/funcoes.php", {
			senhanova : senhanova,
			senhaantiga : senhaantiga,
			mudarSenha : 1
		}, function(result) {
			if (result.replace(/^\s+|\s+$/g, '') == "fim") {
				$("#senhaAntiga, #senhaNova").val("");
				$("#msgSenha").show().html('<div class="alert success"><span class="icon"></span><span class="close">x</span><strong>Sucesso!</strong> Senha modificada com sucesso!</div>');
			} else {
				$("#msgSenha").show().html('<div class="alert error"><span class="icon"></span><span class="close">x</span><strong>Erro!</strong> ' + result + '</div>');
			}
		});
	} else {
		$("#msgSenha").show().html('<div class="alert error"><span class="icon"></span><span class="close">x</span><strong>Erro!</strong> Digite senhas válidas!</div>');
	}
}

function showErrors(errors, placeholder) {
	$('.input-group.has-error').removeClass('has-error');
	$(placeholder).html('');
	if (errors == null && placeholder) {
		return;
	}

	$.each(errors, function(id, message) {
		if (id)
			$('#' + id).parents('.input-group').addClass('has-error');
		if (placeholder)
			$(placeholder).append('<div class="alert alert-danger">' + message[0] + '</div>');
	});

}

function carregaNotificacoes() {
	$("#div_notificacoes, #overlay").show();
	$.post("ajax/funcoes.php", {
		notificacoes : 1
	}, function(result) {
		$("#div_notificacoes span").html(result);
	});
}

function lerNotificacao(id) {
	$("#div_notificacoes, #overlay").show();
	$.post("ajax/funcoes.php", {
		notificacao : 1,
		id : id
	}, function(result) {
		$("#not"+id).css("background", "");
		$("#div_notificacoes span").html(result);
	});
}

function perfil() {
	$("#mudar_perfil, #overlay").show();
}

function fechar() {
	$("#mudar_perfil, #div_notificacoes, #overlay").hide();
}

function clearErrors() {
	$('.input-group.has-error').removeClass('has-error');
}


$(function() {
	$('ul.sidebar-menu li.treeview ul.treeview-menu li').each(function() {
		var href = $(this).find('a').attr('href');

		if (href == window.location.protocol + '//' + window.location.host + window.location.pathname) {
			$(this).addClass('active');
			$(this).closest('li.treeview').addClass('active');
		}
	});

});