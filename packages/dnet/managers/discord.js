const webhook = require("webhook-discord");

let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');

let discord = exports;

discord.report = "https://discordapp.com/api/webhooks/682573681415028740/l0tkdhaVqlCLa_JZQ6xnAE1lE2aZejqq8Zj_x8QvUlAH8hoIB6frc6uZpUPfx3C7K8Ah";
discord.deadlist = "https://discordapp.com/api/webhooks/682680284789211162/OicTpLvtwIVENmFJxs_bOl7fVmiRCPwqOdQvDc34D_6yDFVZZ4Cps-67fbtrj--NYeyQ";
discord.invaderAd = "https://discordapp.com/api/webhooks/710593652170424380/u3gR3RERbhHso4uionfo8gW99rlOYM87VMFTrGQ1InKhYynJUaswQAiMgdZun1Fa9ore";
discord.invaderAd2 = "https://discordapp.com/api/webhooks/724169171025395743/tcUiRFj776_KxogjYDjlJNGxqIkGjMzMmDe5Rk5ypOCwDNJBbG5J_4g-K9T5CwhtzVH4";
discord.invaderNews = "https://discordapp.com/api/webhooks/749837863985610853/8TJa5mtY2hdq1_2NWXoJEiiXT9o4BsDaUgrTungw5xJ5l3BNBVclgXMIiQo8Pf1L1Dkj";
discord.fractionNews = "https://discordapp.com/api/webhooks/682956739792076838/xnKY61UPcvyakdcRkMIFEsaFCMGKuK9u4wT7KK4lN_Spo1EdA_ySlzMOSLtfyW44QWMb";

discord.workBcsd = "https://discordapp.com/api/webhooks/756863874031943772/ALxfZpn9UAbEpjMCmUGO9p5r3-iJbmVeohTflbUcnzTRNdfDCNWvmLhhzCaZZbkri50Q";
discord.workLspd = "https://discordapp.com/api/webhooks/756864901296947342/ooy7wIUlXMIVerUjnptPR356BXqM3-56cg7A0SljbCh8iSSaBEL0QcYlrY-JmYK6LkU-";
discord.workUsmc = "https://discordapp.com/api/webhooks/756865097674260532/86qvZmpKS9sHceYjwwEyxgitSleVXtsWtEJbFliDgEYyeDx76g38RB4UUcbQk5asjKjl";
discord.workNews = "https://discordapp.com/api/webhooks/756864274034589708/hrJQzkZvcLAmW9D_AQ1aeWc3q8dJ7pB0k5oAytMJQ15Cz9MN07Icb0CfGNz6Yhc23BhC";
discord.workEms = "https://discordapp.com/api/webhooks/756864424148729868/dvE9bel8EEuLr_w8lhor6FWDRQLTqF1JBZb1nq_-DonbPTUd5AMmWVac9GZpETGfciXZ";
discord.workGov = "https://discordapp.com/api/webhooks/756864667233812531/KgEtvxABddRxRW7ppLql2kTy4ZPFhFx5cCpvsSVlfdtKmj6i-1A5cJ4LFya9g-xVwbUw";

discord.marketProperty = "https://discordapp.com/api/webhooks/749763956205289622/Vj0e4iqTtJzNGRb3Pb8SUJ5vURW_CoWa2acTUIZ-2JcaDwVYDeL50IDDTQq5uBKjJ5DG";
discord.marketBusiness = "https://discordapp.com/api/webhooks/749764058487455885/iAB-r3YOUVZ0WTrf5XDwua1l1uPhTtocyycFy4MQ3k63n565N5ZovZFFOfG9qTBMJQek";
discord.marketVehicles = "https://discordapp.com/api/webhooks/749764141102923795/qMNyKmk58CkC6WfeivGdMan_Q332zs_ISFeutjhLtwRF2yyWOthHVp_ss92t_7WdOuez";

discord.dednetImg = "https://sun9-51.userapi.com/c858132/v858132444/cc443/c30JAqqT_bc.jpg";
discord.socialClub = "https://a.rsg.sc//n/";

discord.imgGov = "https://i.imgur.com/eFGOitl.png";
discord.imgLspd = "https://i.imgur.com/uRUp6ig.png";
discord.imgFib = "https://i.imgur.com/KaMdGAl.png";
discord.imgUsmc = "";
discord.imgSheriff = "https://i.imgur.com/sOPdklt.png";
discord.imgEms = "https://i.imgur.com/MoMutqI.png";
discord.imgInvader = "https://i.imgur.com/xxUGqJi.png";

discord.colorGov = "#795548";
discord.colorLspd = "#2196F3";
discord.colorFib = "#212121";
discord.colorUsmc = "#9E9E9E";
discord.colorSheriff = "#8BC34A";
discord.colorEms = "#f44336";
discord.colorInvader = "#FFEB3B";

discord.sendFractionList = function (title, sender, message, senderImg = discord.dednetImg, avatar = discord.imgGov, color = "#f44336") {
    const Hook = new webhook.Webhook(discord.fractionNews);

    const msg = new webhook.MessageBuilder()
        .setName('Новости Штата')
        .setTitle(sender)
        .setAvatar(avatar)
        .setDescription(message)
        .setFooter(title, senderImg)
        .setColor(color)
        .setTime();

    Hook.send(msg);
};

discord.sendDeadList = function (target, desc, reason, sender = 'Server', senderImg = discord.dednetImg, color = "#f44336") {
    const Hook = new webhook.Webhook(discord.deadlist);

    const msg = new webhook.MessageBuilder()
        .setName("DEAD LIST")
        .setTitle(target)
        .addField("Описание", desc)
        .addField("Причина", reason)
        .setFooter(sender, senderImg)
        .setColor(color)
        .setTime();

    Hook.send(msg);
};

discord.sendAd = function (title, name, text, phone, editor, editorImg) {
    const Hook = new webhook.Webhook(discord.invaderAd);
    const Hook2 = new webhook.Webhook(discord.invaderAd2);

    let color = "#607D8B";
    if (title === 'Покупка')
        color = "#03A9F4";
    if (title === 'Продажа')
        color = "#8BC34A";
    if (title === 'Услуга')
        color = "#FFEB3B";

    const msg = new webhook.MessageBuilder()
        .setName('Рекламное объявление')
        .setTitle(title)
        .setAvatar(discord.imgInvader)
        .addField(`Phone Number`, `\`\`\`${phone}\`\`\``, true)
        .addField(`Customer`, `\`\`\`${name}\`\`\``, true)
        .setDescription(`\`\`\`fix\n${text}\`\`\``)
        .setFooter(editor, 'https://a.rsg.sc//n/' + editorImg.toLowerCase())
        .setColor(color)
        .setTime();

    Hook.send(msg);
    Hook2.send(msg);
};

discord.sendNews = function (title, text, editor, editorImg) {
    const Hook = new webhook.Webhook(discord.invaderNews);
    const msg = new webhook.MessageBuilder()
        .setName('Новости')
        .setTitle(title)
        .setDescription(text)
        .setFooter(editor, 'https://a.rsg.sc//n/' + editorImg)
        .setColor("#f44336")
        .setTime();

    Hook.send(msg);
};

discord.sendWork = function (url, player, dscrd, text) {

    if (!user.isLogin(player))
        return;

    let history = '';
    let sender = `${user.getRpName(player)} (${user.getId(player)})`;
    let phone = methods.phoneFormat(user.get(player, 'phone'));
    let senderImg = player.socialClub;

    mysql.executeQuery(`SELECT * FROM log_player WHERE user_id = ${user.getId(player)} AND type = 1 ORDER BY id DESC LIMIT 5`, (err, rows, fields) => {
        if (rows.length > 0) {
            try {
                rows.forEach(row => {
                    history += `${methods.unixTimeStampToDateTimeShort(row['timestamp'])} | ${row['do']}\n`;
                });
            }
            catch (e) {
                methods.debug(e);
            }
        }

        if (history === '')
            history = 'Криминальной истории - нет';

        const Hook = new webhook.Webhook(url);
        const msg = new webhook.MessageBuilder()
            .setName('Заявление')
            .setTitle(sender)
            .setDescription(text)
            .addField(`Телефон`, `\`\`\`${phone}\`\`\``, true)
            .addField(`Дискорд`, `\`\`\`${dscrd}\`\`\``, true)
            .addField(`Work ID`, `\`\`\`${user.get(player, 'work_lvl')} / ${user.get(player, 'work_exp')}\`\`\``, true)
            .addField(`История`, `\`\`\`${history}\`\`\``)
            .setFooter(sender, 'https://a.rsg.sc//n/' + senderImg)
            .setColor("#f44336")
            .setTime();

        Hook.send(msg);
    });
};

discord.sendMarketProperty = function (title, text) {
    const Hook = new webhook.Webhook(discord.marketProperty);
    const msg = new webhook.MessageBuilder()
        .setName('Новости имущества')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};

discord.sendMarketBusiness = function (title, text) {
    const Hook = new webhook.Webhook(discord.marketBusiness);
    const msg = new webhook.MessageBuilder()
        .setName('Новости имущества')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};

discord.sendMarketVehicles = function (title, text, imgUrl) {
    const Hook = new webhook.Webhook(discord.marketVehicles);
    const msg = new webhook.MessageBuilder()
        .setName('Новости имущества')
        .setTitle(title)
        .setDescription(`\`\`\`ml\n${text}\`\`\``)
        .setImage(imgUrl)
        .setFooter('Правительство', discord.imgGov)
        .setColor("#f44336")
        .setTime();
    Hook.send(msg);
};