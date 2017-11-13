var defaultPageSize = 8, 
    __token = $('input[name="__RequestVerificationToken"]').val(),
    ICOItem = function(e) {
        var a = this;
        this.Id = e.Id, this.TotalCoin = parseFloat(e.TotalCoin), this.SoldCoin = parseFloat(e.SoldCoin), this.SoldCoin > this.TotalCoin && (this.SoldCoin = this.TotalCoin), this.TimeICO = e.TimeICO, this.TimeBuyICO = e.TimeBuyICO, this.OpenBuyTime = e.OpenBuyTime, this.OpenICOTime = e.OpenICOTime, this.Price = e.Price, this.Limit = Number(parseFloat(e.Limit).toFixed(8)), this.Day = ko.observable(), this.Hour = ko.observable(), this.Minute = ko.observable(), this.Second = ko.observable(), this.BuyICO = !1;
        var t = new xyz;
        if (e.TotalCoin > 0) {
            var o = Number(parseFloat(100 * e.SoldCoin / e.TotalCoin).toFixed(2));
            $("#process--ico").css("width", o + "%").attr("aria-valuenow", o).html(o + "%")
        }
        var i = moment(t.s()),
            n = moment();
        if (e.OpenICOTime) {
            $("#buy--ico--now").removeClass("enabled");
            var s = i.unix() - n.unix();
            s = 0 > s ? 0 : s;
            var l = $("#buy--ico--time").FlipClock({
                clockFace: "DailyCounter",
                autoStart: !1,
                callbacks: {
                    stop: function() {
                        window.location.reload()
                    }
                }
            });
            l.setTime(s), l.setCountdown(!0), l.start()
        } else {
            var c = moment(),
                r = i.unix() - c.unix();
            if (0 > r) $("#div-time-count-down").removeClass("enabled"), $("#div-time-count-down-open").removeClass("enabled"), $("#div-time-count-down-close").addClass("enabled"), $("#buy--ico--now").removeClass("enabled");
            else if (1 == e.OpenBuyTime) a.BuyICO = !0;
            else if (2 == e.OpenBuyTime) {
                $("#buy--ico--now").removeClass("enabled"), $("#div-time-count-down").addClass("enabled"), $("#div-time-count-down-open").removeClass("enabled");
                var u = moment(t.e()),
                    s = u.unix() - n.unix();
                s = 0 > s ? 0 : s;
                var l = $("#buy--ico--time").FlipClock({
                    clockFace: "DailyCounter",
                    autoStart: !1,
                    callbacks: {
                        stop: function() {
                            window.location.reload()
                        }
                    }
                });
                l.setTime(s), l.setCountdown(!0), l.start()
            } else $("#buy--ico--now").removeClass("enabled"), $("#div-time-count-down").removeClass("enabled"), $("#div-time-count-down-open").removeClass("enabled"), $("#div-time-count-down-close").addClass("enabled")
        }
    };
$("#div-buy-uch").on("hidden.bs.modal", function(e) {
    $('input[name="amount--coin"]').val(""), $('input[name="amount--uch"]').val("")
});
var ICOTransaction = function() {
    var e = this;
    e.RefreshCaptcha = 0, e.Limit = 0, e.MaxBuy = 0, e.ICO = ko.observable(), e.Price = ko.observable(), e.UserWallet = ko.observable(), e.Blockchain = "BTC", e.transactionList = ko.observableArray([]), e.pagination = new pagination, e.pagination.pageChanged(function(a) {
        e.GetListTransaction(a)
    }), this.init = function(a, t) {
        e.Limit = a.Limit, e.ICO(new ICOItem(a)), e.UserWallet(t), ko.applyBindings(e, $("#div-ico-controller")[0]), e.GetListTransaction(1, function() {})
    }, this.refreshCaptcha = function() {
        if (1 != e.RefreshCaptcha) {
            e.RefreshCaptcha = 1;
            var a = {};
            a.__RequestVerificationToken = __token, $.ajax({
                url: urlRefresh,
                data: a,
                type: "POST",
                dataType: "json",
                beforeSend: function() {},
                success: function(a) {
                    e.RefreshCaptcha = 0, $(".img-captcha").attr("src", a.Data)
                },
                error: function(a) {
                    e.RefreshCaptcha = 0
                }
            })
        }
    }, this.transferCoin = function(a) {
        if (1 == a) {
            var t = parseFloat($('input[name="amount--coin"]').val().trim()),
                o = "BTC" == e.Blockchain ? parseFloat(e.Price().btc_last_price).toFixed(2) : parseFloat(e.Price().eth_last_price).toFixed(2),
                i = Number(parseFloat(e.ICO().Price).toFixed(8)),
                n = parseFloat(t * o / i).toFixed(8);
            $('input[name="amount--uch"]').val(n)
        } else {
            var t = parseFloat($('input[name="amount--uch"]').val().trim()),
                o = "BTC" == e.Blockchain ? parseFloat(e.Price().btc_last_price).toFixed(2) : parseFloat(e.Price().eth_last_price).toFixed(2),
                i = Number(parseFloat(e.ICO().Price).toFixed(8)),
                n = parseFloat(t * i / o).toFixed(8);
            $('input[name="amount--coin"]').val(n)
        }
    }, this.buyAll = function() {
        if (e.ICO().BuyICO) {
            var a = "BTC" == e.Blockchain ? parseFloat(e.UserWallet().BTC).toFixed(8) : parseFloat(e.UserWallet().ETH).toFixed(8),
                t = "BTC" == e.Blockchain ? parseFloat(e.Price().btc_last_price).toFixed(2) : parseFloat(e.Price().eth_last_price).toFixed(2),
                o = parseFloat(a * t / e.ICO().Price).toFixed(8);
            $('input[name="amount--coin"]').val(a), $('input[name="amount--uch"]').val(o)
        }
    }, this.changeBTC = function() {
        if (e.ICO().BuyICO) {
            $('input[name="amount--coin"]').val(""), $('input[name="amount--uch"]').val(""), e.Blockchain = "BTC", $("#div--amount--coin").html("Amount " + e.Blockchain), $("#btn-bitcoin").addClass("btn-success").removeClass("btn-default"), $("#btn-ethereum").removeClass("btn-success").addClass("btn-default"), $("#total--coin--can").html(parseFloat(e.UserWallet().BTC).toFixed(8)), $("#price--coin").html(parseFloat(e.Price().btc_last_price).toFixed(2)), $("#span--blockchain").html(e.Blockchain), $("#price--coin-label").html("1 BTC");
            var a = Number(parseFloat(e.ICO().Price).toFixed(8)),
                t = Number(parseFloat(e.Price().btc_last_price).toFixed(2)),
                o = Number(parseFloat(e.UserWallet().BTC * t / a).toFixed(8));
            o = o > e.Limit ? e.Limit : o, o > e.ICO().TotalCoin - e.ICO().SoldCoin && (o = e.ICO().TotalCoin - e.ICO().SoldCoin), o = parseFloat(o).toFixed(8), e.MaxBuy = Number(o), $("#max--coin-label").html(o)
        }
    }, this.changeETH = function() {
        if (e.ICO().BuyICO) {
            $('input[name="amount--coin"]').val(""), $('input[name="amount--uch"]').val(""), e.Blockchain = "ETH", $("#div--amount--coin").html("Amount " + e.Blockchain), $("#total--coin--can").html(parseFloat(e.UserWallet().ETH).toFixed(8)), $("#btn-ethereum").addClass("btn-success").removeClass("btn-default"), $("#btn-bitcoin").removeClass("btn-success").addClass("btn-default"), $("#span--blockchain").html(e.Blockchain), $("#price--coin-label").html("1 ETH"), $("#price--coin").html(parseFloat(e.Price().eth_last_price).toFixed(2));
            var a = Number(parseFloat(e.ICO().Price).toFixed(8)),
                t = Number(parseFloat(e.Price().eth_last_price).toFixed(2)),
                o = Number(parseFloat(e.UserWallet().ETH * t / a).toFixed(8));
            o = o > e.Limit ? e.Limit : o, o > e.ICO().TotalCoin - e.ICO().SoldCoin && (o = e.ICO().TotalCoin - e.ICO().SoldCoin), o = parseFloat(o).toFixed(8), e.MaxBuy = Number(o), $("#max--coin-label").html(o)
        }
    }, this.OpenBuyICO = function() {
        if (e.ICO().BuyICO) {
            var a = {};
            a.__RequestVerificationToken = __token, $.ajax({
                url: urlGetPrice,
                data: a,
                type: "POST",
                dataType: "json",
                beforeSend: function() {
                    main.ctr_shw_loadng()
                },
                success: function(a) {
                    e.Price(a.Data), $(".img-captcha").attr("src", a.Records), $("#btn-bitcoin").click(), $("#div-buy-uch").modal("show")
                },
                error: function(e) {}
            })
        }
    }, this.Buy = function() {
        if (e.ICO().BuyICO) {
            var a = e.Blockchain,
                t = $('input[name="captcha"]').val();
            if (null == t || t.trim().length < 5) return $('input[name="captcha"]').css("border", "1px solid #ac2925"), void bootbox.dialog({
                size: "small",
                message: "Captcha is invalid. Please try again",
                title: "Warning",
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-times"></i> Close',
                        className: "btn-warning button-bootbox-close"
                    }
                }
            });
            var o = $('input[name="amount--uch"]').val(),
                i = $('input[name="amount--coin"]').val();
            if (null == i || 0 == i.trim().length || isNaN(i) || 0 >= i) return $('input[name="amount--coin"]').css("border", "1px solid red"), setTimeout(function() {
                $('input[name="amount--coin"]').removeAttr("style")
            }, 3e3), void bootbox.dialog({
                size: "small",
                message: "Amount " + e.Blockchain + " is invalid",
                title: "Warning",
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-times"></i> Close',
                        className: "btn-warning button-bootbox-close"
                    }
                }
            });
            if (null == o || 0 == o.trim().length || isNaN(o) || 0 >= o) return $('input[name="amount--uch"]').css("border", "1px solid red"), setTimeout(function() {
                $('input[name="amount--uch"]').removeAttr("style")
            }, 3e3), void bootbox.dialog({
                size: "small",
                message: "Amount UCH is invalid",
                title: "Warning",
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-times"></i> Close',
                        className: "btn-warning button-bootbox-close"
                    }
                }
            });
            var n = "BTC" == e.Blockchain ? parseFloat(e.UserWallet().BTC).toFixed(8) : parseFloat(e.UserWallet().ETH).toFixed(8);
            if (i = parseFloat(i), n = Number(n), i > n) return void bootbox.dialog({
                size: "small",
                message: "Your wallet " + e.Blockchain + "'s balance is not enough",
                title: "Warning",
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-times"></i> Close',
                        className: "btn-warning button-bootbox-close"
                    }
                }
            });
            var s = e.ICO().Limit;
            if (e.ICO().Limit > e.ICO().TotalCoin - e.ICO().SoldCoin && (s = e.ICO().TotalCoin - e.ICO().SoldCoin), o = Number(parseFloat(o).toFixed(8)), s = Number(parseFloat(s).toFixed(8)), o > s) return void bootbox.dialog({
                size: "small",
                message: "The maximum amount of UCH that you can buy: " + Number(s),
                title: "Warning",
                buttons: {
                    confirm: {
                        label: '<i class="fa fa-times"></i> Close',
                        className: "btn-warning button-bootbox-close"
                    }
                }
            });
            var l = {};
            l.__RequestVerificationToken = __token, l.blockchain = a, l.amount = o, l.captcha = t.trim(), l.coinPaid = i, l.calendar = e.ICO().Id, l.PriceCoin = "BTC" == e.Blockchain ? e.Price().btc_last_price : e.Price().eth_last_price, $.ajax({
                url: urlBuy,
                data: l,
                type: "POST",
                dataType: "json",
                beforeSend: function() {
                    main.ctr_shw_loadng()
                },
                success: function(e) {
                    "OK" == e.Result ? e.Data.IsSuccess ? ($("#div-buy-uch").modal("hide"), bootbox.dialog({
                        message: "Wow! You have successfully bought UCH! Congratulations!",
                        title: "",
                        buttons: {
                            confirm: {
                                label: '<i class="fa fa-times"></i> Close',
                                className: "btn-warning button-bootbox-close",
                                callback: function() {
                                    window.location.reload()
                                }
                            }
                        }
                    })) : bootbox.dialog({
                        size: "small",
                        message: e.Data.Message,
                        title: "Warning",
                        buttons: {
                            confirm: {
                                label: '<i class="fa fa-times"></i> Close',
                                className: "btn-warning button-bootbox-close"
                            }
                        }
                    }) : bootbox.dialog({
                        size: "small",
                        message: e.Message,
                        title: "Warning",
                        buttons: {
                            confirm: {
                                label: '<i class="fa fa-times"></i> Close',
                                className: "btn-warning button-bootbox-close"
                            }
                        }
                    })
                },
                error: function(e) {}
            })
        }
    }, this.GetListTransaction = function(a, t) {
        var o = {};
        o.pageIndex = a, o.pageSize = defaultPageSize, o.calendar = e.ICO().Id, o.all = $("#select-transaction").val(), o.__RequestVerificationToken = __token, $.ajax({
            url: urlTransaction,
            data: o,
            type: "POST",
            dataType: "json",
            beforeSend: function() {
                $("#select-transaction").attr("disabled", !0)
            },
            success: function(a) {
                if ("OK" == a.Result) {
                    $("#select-transaction").removeAttr("disabled"), e.transactionList.removeAll();
                    var o = 0;
                    if ($.each(a.Records.Records, function(a, t) {
                            o++, t.Amount = parseFloat(t.Amount).toFixed(8);
                            var i = moment(t.CreatedDate).format("YYYY-MM-DD HH:mm:ss");
                            t.DateCreated = i, e.transactionList.push(t)
                        }), 0 == o) {
                        $("#no-item-found-alert").addClass("enabled");
                        var i = "";
                        i = "You have not made any transactions. Once you do, they will appear here.", $("#no-item-found-alert td").html('<div class="text-center">' + i + "</div>")
                    } else $("#no-item-found-alert").removeClass("enabled");
                    t && t()
                }
            },
            error: function(e) {
                $("#select-transaction").removeAttr("disabled")
            }
        })
    }
};