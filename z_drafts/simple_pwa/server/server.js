"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var EXPRESS = require("express");
var IMAP = require("imap-simple");
var mailparser_1 = require("mailparser");
var PORT = 3000;
var CFG = {
    imap: {
        user: process.argv[2],
        password: process.argv[3],
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { "servername": "imap.gmail.com" },
        authTimeout: 3000
    }
};
var express = EXPRESS();
var imap = null;
express.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, IMAP.connect(CFG)];
            case 1:
                imap = _a.sent();
                return [4 /*yield*/, imap.openBox('INBOX')];
            case 2:
                _a.sent();
                console.log('IMAP-REST server running on port ' + PORT);
                return [2 /*return*/];
        }
    });
}); });
express.get('/all', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var res, mails, _i, mails_1, mail, m;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.setHeader("Cache-Control", "no-cache, must-revalidate");
                response.setHeader("Access-Control-Allow-Origin", "*");
                res = [];
                return [4 /*yield*/, imap.search(['ALL'], { bodies: [''], markSeen: false })];
            case 1:
                mails = _a.sent();
                _i = 0, mails_1 = mails;
                _a.label = 2;
            case 2:
                if (!(_i < mails_1.length)) return [3 /*break*/, 5];
                mail = mails_1[_i];
                return [4 /*yield*/, mailparser_1.simpleParser('Imap-Id: ' + mail.attributes.uid + '\r\n' + mail.parts[0].body)];
            case 3:
                m = _a.sent();
                console.log('=====================================================');
                console.log(m);
                res.push({
                    uid: mail.attributes.uid,
                    subject: m.subject,
                    html: m.html,
                    text: m.text
                });
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                res.reverse();
                response.send(res);
                return [2 /*return*/];
        }
    });
}); });
