if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

(function ($) {

    var pathname = window.location.pathname;

    function st(term) {
        // TODO placeholder for results translation function
        return term;
    }


    Drupal.behaviors.uclsearch = {

        attach: function (context, settings) {
            searchSettings = settings.uclsearch;

            // force loading translations
            Drupal.t('directory');
            Drupal.t('term');
            Drupal.t('course');
            Drupal.t('program');

            FIELDS = {};

            // focus when clicking on the glass
            $("a.search").on('click', function() {

                if ( $(window).width() <= 767 && ( settings.pathPrefix != undefined || settings.pathPrefix.length ) ) {
                    window.location = '/' + settings.pathPrefix + 'uclsearch';
                    return false;
                }

                // create timeout according to bootsrap data-toggle bahaviour
                setTimeout(function(){
                    $("input.uclsearch-bar").focus();
                }, 10);
            });

            // must reinit research
            if ($(location).attr('pathname').indexOf('uclsearch') < 0) {
              Drupal.behaviors.uclsearch.resetSearch();
            }

            if (!('size' in sessionStorage)) {
                sessionStorage["size"] = 10;
            }

            if ( !('field-count' in sessionStorage) ) {
                sessionStorage["field-count"] = 0;
            }

            if (!('cloud-size' in sessionStorage)) {
                sessionStorage["cloud-size"] = 60;
            }

            if (!('from' in sessionStorage)) {
                sessionStorage["from"] = null;
            }

            if (!('total' in sessionStorage)) {
                sessionStorage["total"] = null;
            }

            if (!('items' in sessionStorage)) {
                sessionStorage["items"] = {};
            }

            if (!('doc-types' in sessionStorage)) {

                var doctypes = searchSettings.searchOptions['doc-types'];
                var doctypes_arr = ['page'];

                for ( var doctype in doctypes) {

                  doctypes_arr.push(doctype);
                }

                sessionStorage["doc-types"] = JSON.stringify(doctypes_arr);
                //sessionStorage["doc-types"] = JSON.stringify(["page", "event", "form", "menuentry", "news", "newsletter", "testimonial"]);
            }

            if (!('decays' in sessionStorage)) {
                sessionStorage["decays"] = JSON.stringify(["time", "depth"]);
            }

            $('.search-filter .menu .collapsed-item').once(function() {

                $(this).on('click', ".facet-type", function (e) {
                  e.preventDefault();
                  $(this).next().toggleClass('open');
                  var facet_type = $(this).data("id");
                  Drupal.behaviors.uclsearch.launchFacets(facet_type);
                });

            });


            $('.search-filter-facets').once(function() {

                $(this).on('click', ".collapseMenu", function (e) {

                    e.preventDefault();
                    $(this).toggleClass('open');
                    var facet_type = $(this).prev().data("id");

                    Drupal.behaviors.uclsearch.launchFacets(facet_type);
                });

            });

            $('.uclsearch-directory').on('click', '.uclsearch-more', function() {

                var settings = {
                close: {
                  glyph: '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>',
                  label: Drupal.t('More results')
                },
                show: {
                  glyph: '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>',
                  label: Drupal.t('Less results')
                }
              };

              var minimum_items = $(this).data('minimum-items') != 'undefined' ? $(this).data('minimum-items') : 3;
              var menu = $(this).data('directory-menu') != 'undefined' ? $(this).data('directory-menu') : 'close';

              if ( menu != 'undefined' ) {
                if ( menu == 'close' ) {
                  $(this).html(settings.show.glyph + settings.show.label);
                  $('.uclsearch-directory .uclsearch-directory-internal-div:nth-child(n+5)').each(function() {
                    $(this).show();
                  });
                }
                else {
                  $(this).html(settings.close.glyph + settings.close.label);
                  $('.uclsearch-directory .uclsearch-directory-internal-div:nth-child(n+5)').each(function() {
                    $(this).hide();
                  });
                }

                $(this).data('directory-menu', menu == 'close' ? 'show' : 'close');
              }
            });

            $('.uclsearch-directory').on('click', '.uclsearch-directory-internal-div', function() {
              if ( $(this).find('.directory-more') && $(this).find('.directory-more').attr('href') != 'undefined' ) {
                window.location = $(this).find('.directory-more').attr('href');
              }
            });

            Drupal.behaviors.uclsearch.resizeContent();

            $(window).resize(function () {
                Drupal.behaviors.uclsearch.resizeContent();
            }).resize();

            Drupal.behaviors.uclsearch.initOptions();

            Drupal.behaviors.uclsearch.resizeContent();


            $(".uclsearch-tags").tagit({
                afterTagAdded: function (event, ui) {
                    $(".uclsearch-bar").val("");
                    $(".uclsearch-bar").autocomplete("close");
                    $('.uclsearch-reset').show();
                },
                beforeTagRemoved: function (event, ui) {
                    var span = ui.tag.find("span.tagit-label");
                    var text = span[0].textContent;
                    Drupal.behaviors.uclsearch.removeHiddenField(text);
                },
                afterTagRemoved: function (event, ui) {
                    $(".uclsearch-tags").blur();
                    $(".uclsearch-keywords").blur();
                    sessionStorage["from"] = 0;
                    var phrase = $('.uclsearch-bar').val();
                    if ( phrase || $('.uclsearch-tags > li.tagit-choice').length ) {

                        Drupal.behaviors.uclsearch.launchSearch();
                    }
                    if($('.tagit-label').length > 0) {
                        $('.uclsearch-reset').show();
                    } else {
                        $('.uclsearch-reset').hide();
                    }
                }
            });
            $('.uclsearch-tags .ui-autocomplete-input').prop('disabled', true).val('');

            // CREDITS: https://jqueryui.com/autocomplete/#categories
            $.ui.autocomplete.prototype._renderMenu = function (ul, items) {
                var that = this;
                var currentCategory = "";

                $.each(items, function (index, item) {
                    var li;

                    /*if ( item.category == 'term' ) {
                      currentCategory = item.category;
                    }
                    else */ if (item.category != currentCategory) {
                        ul.append("<li class='ui-autocomplete-group'>" + Drupal.t(item.category) + "</li>");
                        currentCategory = item.category;
                    }

                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });

            };

            Drupal.behaviors.uclsearch.autocomplete(settings);

            if (searchSettings.hasOwnProperty('tags') !== false) {
                var defaultTags = JSON.parse(searchSettings.tags);
                $.each(defaultTags, function (index, tag) {
                    var item = {};
                    if(tag.startsWith("#")) {
                        item["cat"] = "domain";
                    } else {
                        item["cat"] = "phrase";
                    }
                    item["value"] = tag;
                    Drupal.behaviors.uclsearch.addHiddenField(item);
                });
            }

            if (searchSettings.hasOwnProperty('launch') && searchSettings.launch == true) {
                Drupal.behaviors.uclsearch.launchSearch();
            }

            $(document).on("click", ".facet-item", function () {

                var phrase = $('.uclsearch-bar').val();
                var facet_id = $(this).data("id");
                var facet_type = $(this).data("name");

                if (facet_type == "domain") {
                    Drupal.behaviors.uclsearch.constraintSearch("#" + facet_id);
                } else if (facet_type == "mwe") {
                    var item = {
                        "cat": "phrase",
                        "value": facet_id
                    };

                    Drupal.behaviors.uclsearch.addHiddenField(item);
                }
                $('.uclsearch-bar').val(phrase);
                Drupal.behaviors.uclsearch.launchSearch();
                $('#facets-modal').modal("hide");
            });

            $('.uclsearch-reset').on('click', function (event) {
                Drupal.behaviors.uclsearch.resetSearch();
            });

            $('.show-facets').on('click', function (event) {
                event.preventDefault();
                var type = $(".facet-type").val();

                Drupal.behaviors.uclsearch.launchFacets(type);
            });

            $('.facet-type').on('change', function () {
                var type = $(this).val();
                Drupal.behaviors.uclsearch.launchFacets(type);
            });

            $('.uclsearch-show-options').on('click', function (event) {
                $('#options-modal').modal("show");
                return false
            });

            if ('search-items' in sessionStorage) {
                FIELDS = {};
                var fields = JSON.parse(sessionStorage["search-items"]);
                for (var i in fields) {
                    var item = fields[i];
                    Drupal.behaviors.uclsearch.addHiddenField(item);
                }
                Drupal.behaviors.uclsearch.launchSearch();
            }

            $('div.uclblock-top div.link_go_up').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 'slow');
            });

            $('a#loadMoreLink').on('click', function(e) {
                e.preventDefault();

                var tags = Drupal.behaviors.uclsearch.getTags();
                var query = Drupal.behaviors.uclsearch.parseQuery(tags);
                var main_query = Drupal.behaviors.uclsearch.clone(query);

                var current_page = Number(sessionStorage['from']) + 1;
                var result_per_page = Number(sessionStorage['size']);
                var total = Number(sessionStorage['total']);
                var max_page = Math.ceil(total / result_per_page);
                var next_page = current_page < max_page ? current_page + 1 : max_page;

                sessionStorage['from'] = current_page;
                main_query['start'] = current_page * result_per_page;

                $.ajax({
                    type: "POST",
                    url: $(this).attr('href'),
                    data: main_query,
                    error: function (jqXHR, textStatus, errorThrown) {
                        Drupal.behaviors.uclsearch.errorMessage('An error occured');
                    },
                    success: function (data, textStatus, jqXHR) {
                        $('div#uclsearch-results').append(data);
                    }
                });

                if ( next_page == max_page ) {

                    $('div.uclsearch-pagination > div.uclblock-pager').hide();
                }

                if ( current_page >= 1 ) {

                    $('div.uclblock-top').show();
                }
                else {

                    $('div.uclblock-top').hide();
                }
            });

            // if ( Drupal.ajax != undefined && $('a#loadMoreLink').length ) {
            //
            //     Drupal.ajax['loadMoreLink'].beforeSerialize = function (element, options) {
            //
            //         var tags = Drupal.behaviors.uclsearch.getTags();
            //         var query = Drupal.behaviors.uclsearch.parseQuery(tags);
            //         var main_query = Drupal.behaviors.uclsearch.clone(query);
            //
            //         var current_page = Number(sessionStorage['from']) + 1;
            //         var result_per_page = Number(sessionStorage['size']);
            //         var total = Number(sessionStorage['total']);
            //         var max_page = Math.ceil(total / result_per_page);
            //         var next_page = current_page < max_page ? current_page + 1 : max_page;
            //
            //         sessionStorage['from'] = current_page;
            //         main_query['start'] = current_page * result_per_page;
            //
            //         options.data = main_query;
            //
            //         if ( next_page == max_page ) {
            //
            //             $('div.uclsearch-pagination > div.uclblock-pager').hide();
            //         }
            //
            //         if ( current_page >= 1 ) {
            //
            //             $('div.uclblock-top').show();
            //         }
            //         else {
            //
            //             $('div.uclblock-top').hide();
            //         }
            //
            //         Drupal.ajax.prototype.beforeSerialize(element, options);
            //     }
            // }
        },
        detach: function (context) {

        }
    };

    Drupal.behaviors.uclsearch.removeFromSearch = function(item) {
        $.ajax({
            url: searchSettings.searchUrls.clearURL + item
        });
    };

    Drupal.behaviors.uclsearch.resizeContent = function () {
        $('.uclsearch-directory-list li.directory-item:gt(2)').hide();
    };

    Drupal.behaviors.uclsearch.constraintSearch = function (domain) {
        var field = "domain(" + domain + ")";
        if (!(field in FIELDS)) {
            var item = {
                "cat": "domain",
                "value": domain
            };
            Drupal.behaviors.uclsearch.addHiddenField(item);
        }
    };


    Drupal.behaviors.uclsearch.autocomplete = function () {

        $(".uclsearch-bar").autocomplete({
            delay: 0,
            minLength: 3,

            select: function (event, ui) {
                $('#edit-query').val(ui.item.value);
                $('#uclsearch-search-form').submit();

                return false;
            },

            source: function (request, response) {
                var querystring = request.term.trim();

                var result = Drupal.behaviors.uclsearch.splitQuery(querystring);
                var category = result.domain;
                var terms = result.terms;
                var queryData = {
                    prefix: terms,
                    field: "",
                    size: sessionStorage["size"]
                }
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                    url: searchSettings.searchUrls.autocompleteURL,
                    data: queryData,
                    // error: function (jqXHR, textStatus, errorThrown) {
                    //     // Drupal.behaviors.uclsearch.errorMessage('An error occured');
                    // },
                    success: function (data, textStatus, jqXHR) {
                        if(data = Drupal.behaviors.uclsearch.curlAjaxErrorHandle(data)) {
                            var S = [];
                            var D = {}

                            for (var i in data) {
                                var suggestion = data[i];

                                var cat = [];

                                var term = suggestion.id;

                                parts = term.split(";"); //ENTITIES/MWE/WORD
                                if (parts.length > 1) {
                                    cat.push(parts[0]);
                                    term = parts[1];
                                } else {
                                    term = parts[0];
                                }
                                cat = cat.join(" ");
                                if (cat == "phrase" || cat == "word")
                                    cat = "term";

                                if (D.hasOwnProperty(cat) == false)
                                    D[cat] = [];

                                var pattern_label_1 = / - /;
                                var pattern_label_2 = /' /;

                                var label = suggestion.label;
                                label = label.replace(pattern_label_1, "-");
                                label = label.replace(pattern_label_2, "'");

                                D[cat].push({
                                    "id": suggestion.id,
                                    "label": label,
                                    "category": cat,
                                    "cat": category,
                                    "value": label
                                });

                            }

                            for (cat in D) {
                                for (var i in D[cat])
                                    S.push(D[cat][i]);
                            }

                            response(S);
                        }
                    }
                });
            }
        });
    };

    //CREDITS: http://stackoverflow.com/questions/10270711/copy-associative-array-in-javascript
    Drupal.behaviors.uclsearch.clone = function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Drupal.behaviors.uclsearch.clone(obj[attr]);
        }
        return copy;
    }

    Drupal.behaviors.uclsearch.getTags = function () {
        var tags = $(".search-tags").map(function () {
            return $(this).data();
        }).get();

        var inputPhrase = $('.uclsearch-bar').val();

        if ( inputPhrase == null || inputPhrase == "" ) {

          return null;
        }

        tags.push({category: 'phrase', value: inputPhrase});

        return tags;
    };

    Drupal.behaviors.uclsearch.resetSearch = function() {

        $(".uclsearch-content-container").empty();
        $(".uclsearch-facets-container h1").remove();
        $(".uclsearch-facets").empty();
        $('div.uclsearch-pagination > div.uclblock-pager').hide();
        $('div.uclblock-top').hide();

        $(".search-tags").each(function() {
            var category = $(this).data("category");
            var value = $(this).data("value");
            $('.uclsearch-tags').tagit('removeTagByLabel', value);
        });
        $.ajax({
            url: searchSettings.searchUrls.clearURL,
            success: function(data) {
                Drupal.behaviors.uclsearch.launchSearch();
            }
        });
    };

    Drupal.behaviors.uclsearch.errorMessage = function (message) {
        $('.uclsearch-results.uclblock-list_search').html(Drupal.t(message));
    };

    Drupal.behaviors.uclsearch.curlAjaxErrorHandle = function (data) {
        if (data.hasOwnProperty('status') && data.status === 'OK') {
            return data.data;
        } else {
            Drupal.behaviors.uclsearch.errorMessage('An error has occured');
            return false;
        }
    };
    Drupal.behaviors.uclsearch.launchSearch = function () {

        var tags = Drupal.behaviors.uclsearch.getTags();

        $(".uclsearch-content-container").empty();
        $(".uclsearch-facets-container h1").remove();
        $(".uclsearch-facets").empty();
        $(".uclsearch-directory").empty();
        $('div.uclsearch-pagination > div.uclblock-pager').hide();
        $('div.uclblock-top').hide();

        if (tags == null || tags == "") {
            // console.log("No query ... Search aborted!")
            return false;
        }

        var query = Drupal.behaviors.uclsearch.parseQuery(tags);
        var main_query = Drupal.behaviors.uclsearch.clone(query);

        // var cnt_from = 0;

        // if (sessionStorage["from"] != "null") {
        //   cnt_from = parseInt(sessionStorage["from"]);
        // }

        main_query["start"] = 0;
        sessionStorage['from'] = 0;
        searchSettings.launch = false;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: searchSettings.searchUrls.docURL,
            data: main_query,
            error: function (jqXHR, textStatus, errorThrown) {
                Drupal.behaviors.uclsearch.errorMessage('An error has occured');
            },
            success: function (data, textStatus, jqXHR) {
                if(data = Drupal.behaviors.uclsearch.curlAjaxErrorHandle(data)) {
                    var hasChange = false;
                    if (data.hasOwnProperty('total')) {
                        sessionStorage["total"] = data["total"];
                    }
                    if (data.hasOwnProperty('results')) {
                        hasChange = true;
                        $(".uclsearch-content-container").replaceWith(data.results.html);

                        // Display or not display pager
                        if ( Number(sessionStorage['total']) > Number(sessionStorage['size']) ) {

                            $('div.uclsearch-pagination > div.uclblock-pager').show();
                        }
                    }
                    if (data.hasOwnProperty('filters')) {
                        hasChange = true;
                        $(".uclsearch-facets").html(data.filters.html);
                    }
                    if(hasChange) {
                        Drupal.behaviors.uclsearch.resizeContent();
                        Drupal.behaviors.uclsearch.suggestions();

                        var directory_query = Drupal.behaviors.uclsearch.clone(query);
                        directory_query["size"] = 1000;
                        for (var k in directory_query["filters"]) {
                            if (JSON.stringify(directory_query["filters"][k]["fields"]) == JSON.stringify(["document.type"])) {
                                directory_query["filters"][k]["query"] = ["directory"];
                            }
                        }

                        // Display or not display title 'Filters'
                        if ( data['total'] == 0 && data['facets'][0].domain_types.length == 0 ) {
                          // if ( $(".search-filter-facets").prev().hasClass('page-header') ) {
                          //   $(".search-filter-facets").prev().hasClass('page-header').remove();
                          // }
                          $("#uclsearch-facets-title").hide();
                        }
                        else {
                          // $(".search-filter-facets").before('<h1 class="page-header">' + Drupal.t('Filters') + '</h1>');
                          $("#uclsearch-facets-title").show();
                        }

                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: searchSettings.searchUrls.docURL,
                            data: directory_query,
                            success: function (data, textStatus, jqXHR) {
                                if(data = Drupal.behaviors.uclsearch.curlAjaxErrorHandle(data)) {
                                    if (data.hasOwnProperty('html')) {
                                        $(".uclsearch-directory").html(data.html);
                                        Drupal.behaviors.uclsearch.resizeContent();
                                        if ( data['total'] == 0 && data['facets'][0].domain_types.length == 0 ) {
                                          // if ( $(".search-filter-directory").prev().hasClass('page-header') ) {
                                          //   $(".search-filter-directory").prev().hasClass('page-header').remove();
                                          // }
                                          $("#uclsearch-persons-title").hide();
                                        }
                                        else {
                                          // $(".search-filter-directory").before('<h1 class="page-header">' + Drupal.t('Persons') + '</h1>');
                                          $("#uclsearch-facets-title").show();
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });

        return false;
    };

    Drupal.behaviors.uclsearch.suggestions = function() {
        $('.uclsearch-dym.block-title').on('click', ".suggestion", function () {
            var error = this.dataset.error;
            var correction = this.textContent;
            sessionStorage["from"] = 0;
            Drupal.behaviors.uclsearch.updateSearch(error, correction);
            Drupal.behaviors.uclsearch.launchSearch();
        });
    };

    Drupal.behaviors.uclsearch.initOptions = function () {
        var options_html = "";
        $.each(searchSettings.searchOptions, function( index, value ) {
            options_html += '<div class="input-group">';
            options_html += '<span class="input-group-addon"><b>'+ Drupal.t('uclsearch-option' + index) + '</b></span>';
            options_html += '<select name="option-' + index + '" class="uclsearch-option-' + index + '" class="form-control" multiple="multiple">';
            $.each(value, function( optindex, optvalue ) {
                var opts = JSON.parse(sessionStorage[index]);
                if (opts.indexOf(optindex) != -1) {
                    options_html += '<option value="' + optindex + '" selected="selected">' + optvalue + '</option>';
                } else {
                    options_html += '<option value="' + optindex + '">' + optvalue + '</option>';
                }
            });
            options_html += '</select>';
            options_html += '</div>';
        });

        $(".uclsearch-options-list").html(options_html);

        $.each(searchSettings.searchOptions, function( optgroup, optgroupvalues ) {
            $('.uclsearch-option-' + optgroup ).multiselect({
                buttonWidth: "100%",
                includeSelectAllOption: true,
                onChange: function (element, checked) {
                    var S = $('.uclsearch-option-' + optgroup + ' option:selected');

                    var selected = [];
                    $(S).each(function (index, selection) {
                        selected.push($(this).val());
                    });

                    sessionStorage[optgroup] = selected;
                    Drupal.behaviors.uclsearch.launchSearch();
                }
            });
        });
    };

    Drupal.behaviors.uclsearch.parseQuery = function (tags, words) {
        var query;

        query = {};
        query["metadata"] = [];
        query["queries"] = [];
        query["filters"] = [];
        query["size"] = sessionStorage["size"];

        var highlight = [];

        for (var i in tags) {
            var tag = tags[i];
            var category = tag.category;
            var value = tag.value;

            if (category == "phrase") {
                highlight.push(value);

                var part = {};

                // part["fields"] = [
                //   "content.fr^2", "title.fr^3", "url.fr^2",
                //   "content.en^2", "title.en^3", "url.en^2",
                //   "content.default", "title.default^3", "url.default"];
                // part["type"] = "phrase";

                part["fields"] = searchSettings.searchQuery['fields'];
                part["type"] = searchSettings.searchQuery['type'];
                part["query"] = value;

                query["queries"].push(part);
            } else if (category == "domain") {
                var filter = {};

                var domainPattern = new RegExp('#([^ ]*)', 'g');
                var data = domainPattern.exec(value);

                if (data == null) {
                    // console.log("Wrong domain '" + value + "' ... Skipped!")
                } else {
                    filter["type"] = "raw";
                    filter["fields"] = ["document.domains.id"];
                    filter["query"] = data[1];
                    query["filters"].push(filter);
                }
            }

        }

        var doc_types = JSON.parse(sessionStorage["doc-types"]);
        if (doc_types.length > 0) {
            var filter = {};
            filter["type"] = "list";
            filter["fields"] = ["document.type"];
            filter["query"] = doc_types;
            filter["operator"] = "or";

            query["filters"].push(filter);
        }

        var decays = JSON.parse(sessionStorage["decays"]);
        if (decays.length > 0) {
            query["decays"] = [];

            for (var j in decays) {
                var decay_type = decays[j];

                if (decay_type == "time") {
                    var date = new Date();

                    var dd = date.getDate();
                    if ( dd < 10 ) dd = '0' + dd;
                    var mm = date.getMonth()+1;
                    if ( mm < 10 ) mm = '0' + mm;
                    var yy = date.getFullYear();
                    var now =  yy+'-'+mm+'-'+dd+' 00:00:00';
                    //console.log(now);

                    var decay = {};
                    decay["origin"] = now;
                    decay["field"] = "document.edition_date";
                    decay["scale"] = "730d";
                    decay["offset"] = "365d";
                    decay["decay"] = 0.3;
                    decay["weight"] = 21;
                    decay["shape"] = "exp";
                    query["decays"].push(decay);
                } else if (decay_type == "depth") {
                    var decay = {};
                    decay["origin"] = 1;
                    decay["field"] = "document.url_depth";
                    decay["scale"] = 2;
                    decay["decay"] = 0.5;
                    decay["offset"] = 1;
                    decay["shape"] = "gauss";
                    decay["weight"] = 42;
                    query["decays"].push(decay);
                }
            }
        }

        if (highlight.length > 0) {
            query["highlight"] = highlight;
        }
        // pass js session to drupal
        var sessionData = {};
        for ( var i = 0, len = sessionStorage.length; i < len; ++i ) {
            sessionData[sessionStorage.key( i )] = sessionStorage.getItem( sessionStorage.key( i ) );
        }
        query["sessionStorage"] = sessionData;

        return query;
    };

    Drupal.behaviors.uclsearch.addHiddenField = function (item) {

        var category = item.cat;
        var value = item.value;

        var field = category + "(" + value + ")";

        if (field in FIELDS) {
          return;
        }

        if ( category == 'domain' ) {

          //var length = Object.keys(FIELDS).length;
          var length = sessionStorage["field-count"];
          sessionStorage["field-count"] = parseInt(sessionStorage["field-count"]) + 1.0;
          var id = "TERM-" + length;

          FIELDS[field] = length;

          $('<input>').attr({
              "type": 'hidden',
              "id": id,
              "class": 'search-tags'
          }).data({
              "category": category,
              "value": value
          }).appendTo('#hidden-search-fields');

          var additionalClass = '';
          if(category == 'phrase') {
              additionalClass = 'alert alert-info';
          }
          if(category == 'domain') {
              additionalClass = 'alert alert-success';
          }

          $('.uclsearch-tags').tagit('createTag', item, additionalClass);
        }
        else {
          $(".uclsearch-bar").val( value );
        }
    };

    Drupal.behaviors.uclsearch.removeHiddenField = function (text) {
        Drupal.behaviors.uclsearch.removeFromSearch(text);
        var field = "";
        if (text.match("^#")) {
            field = "domain(" + text + ")";
        } else {
            field = "phrase(" + text + ")";
        }

        if (!(field in FIELDS)) {
            // console.log("WARNING: field '" + field + "' doesn't exist!")
            return;
        }

        var id = "#TERM-" + FIELDS[field];
        delete FIELDS[field];
        $(id).remove();
    };

    Drupal.behaviors.uclsearch.constraintSearch = function (domain) {
        var field = "domain(" + domain + ")";
        if (!(field in FIELDS)) {
            var item = {
                "cat": "domain",
                "value": domain
            };

            Drupal.behaviors.uclsearch.addHiddenField(item);
        }
    };

    Drupal.behaviors.uclsearch.updateSearch = function (error, correction) {
        $(".search-tags").each(function () {
            var category = $(this).data("category");
            var value = $(this).data("value");

            $('.uclsearch-tags').tagit('removeTagByLabel', value);

            if (value == error) {
                value = correction;
            }

            var item = {
                "cat": category,
                "value": value
            };

            Drupal.behaviors.uclsearch.addHiddenField(item);


            return false;
        });
    };

    Drupal.behaviors.uclsearch.splitQuery = function (query) {
        var data = query.split(" ");

        var domains = [];
        var terms = [];

        for (var i in data) {
            var current = data[i];
            if (current.match("^#")) {
                domains.push(current);
            } else {
                terms.push(current);
            }
        }

        if (domains.length > 1) {
            // console.log("You can provide only one domain! Skipping...");
        } else if (domains.length == 0) {
            return {
                "domain": "",
                "terms": terms.join(" ")
            }
        } else {
            return {
                "domain": domains[0],
                "terms": terms.join(" ")
            }
        }
    };

    Drupal.behaviors.uclsearch.launchFacets = function (type) {
        if (type === undefined) {
            type = domain;
        }
        var tags = Drupal.behaviors.uclsearch.getTags();

        if (tags == null || tags == "") {
            // console.log("No query ... Search aborted!");
            return false;
        }

        var query = Drupal.behaviors.uclsearch.parseQuery(tags);

        query["size"] = 0;
        query["cloud"] = [];

        var cloud = {};

        cloud["name"] = "domain";
        cloud["type"] = "document";
        cloud["subtype"] = "domain";
        cloud["filter"] = type;
        cloud["size"] = sessionStorage["cloud-size"];

        query["cloud"].push(cloud);

        $.ajax({
            type: "POST",
            dataType: "json",
            url: searchSettings.searchUrls.tagURL,
            data: query,

            success: function (data, textStatus, jqXHR) {
                if(data = Drupal.behaviors.uclsearch.curlAjaxErrorHandle(data)) {
                    var total = 0;
                    var max = 0;
                    var facets = [];

                    for (var element in data["facets"][0]) {
                        for (var i in data["facets"][0][element]) {
                            var facet = data["facets"][0][element][i];

                            var count;
                            if ("stats" in facet) {
                                count = facet["stats"]["count"];
                            } else {
                                count = facet["doc_count"];
                            }

                            total += count;
                            if (count > max) {
                                max = count;
                            }

                            var label;
                            var id;
                            if ("childs" in facet) {
                                label = facet["childs"][0];
                                id = facet["key"];
                            }
                            else {
                                label = facet["key"];
                                id = facet["key"];
                            }

                            if (element == "mwe") {
                                parts = label.split(";");
                                if (parts.length > 1) {
                                    label = parts[1];
                                    id = parts[1];
                                } else {
                                    label = parts[0];
                                    id = parts[0];
                                }
                            }

                            facets.push({"label": label, "count": count, "id": id, "name": element});
                        }

                        facets.sort(function( item1, item2 ){
                          if((item1.label+'').toLowerCase() > (item2.label+'').toLowerCase()) return 1
                          if((item1.label+'').toLowerCase() < (item2.label+'').toLowerCase()) return -1
                          return 0
                        });
                    }

                    if ($('[data-id="' + type + '"]').hasClass("empty") == true) {
                        var facets_html = '<ul data-parent="' + type + '">';
                        for (var i in facets) {
                            var facet = facets[i];
                            facets_html += '<li><a href="#" class="facet-item second" title="' + facet["label"] + '" data-name="' + facet["name"] + '" data-id="' + facet["id"] + '">' + facet["label"] + "</a></li>";
                        }
                        facets_html += "</ul>"
                        $('[data-id="' + type + '"]').next().after(facets_html);
                        $('[data-id="' + type + '"]').removeClass("empty");
                    } else {
                        $('[data-parent="' + type + '"]').remove();
                        $('[data-id="' + type + '"]').addClass("empty");
                    }
                }
            }
        });

        return false;
    };

}(jQuery));
