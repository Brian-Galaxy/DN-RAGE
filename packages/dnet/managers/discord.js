const webhook = require("webhook-discord");

let discord = exports;

discord.report = "https://discordapp.com/api/webhooks/682573681415028740/l0tkdhaVqlCLa_JZQ6xnAE1lE2aZejqq8Zj_x8QvUlAH8hoIB6frc6uZpUPfx3C7K8Ah";
discord.deadlist = "https://discordapp.com/api/webhooks/682680284789211162/OicTpLvtwIVENmFJxs_bOl7fVmiRCPwqOdQvDc34D_6yDFVZZ4Cps-67fbtrj--NYeyQ";
discord.invaderAd = "https://discordapp.com/api/webhooks/710593652170424380/u3gR3RERbhHso4uionfo8gW99rlOYM87VMFTrGQ1InKhYynJUaswQAiMgdZun1Fa9ore";
discord.invaderAd2 = "https://discordapp.com/api/webhooks/724169171025395743/tcUiRFj776_KxogjYDjlJNGxqIkGjMzMmDe5Rk5ypOCwDNJBbG5J_4g-K9T5CwhtzVH4";
discord.invaderNews = "https://discordapp.com/api/webhooks/682694685805903912/0-VByP6Nd_3xH3yrgs5DAOFpGnMXUHuLX1NmiCc-QlaMhBCLPcuf4BXr87VO7pbwu3Ck";
discord.fractionNews = "https://discordapp.com/api/webhooks/682956739792076838/xnKY61UPcvyakdcRkMIFEsaFCMGKuK9u4wT7KK4lN_Spo1EdA_ySlzMOSLtfyW44QWMb";

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
        .setTitle(title)
        .setDescription(text)
        .setFooter(editor, 'https://a.rsg.sc//n/' + editorImg)
        .setColor("#f44336")
        .setTime();

    Hook.send(msg);
};