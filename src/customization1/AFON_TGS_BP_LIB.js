/**
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 * @NApiVersion 2.0
 * @NModuleScope Public
 */

define([
    'N/config',
    'N/runtime',
    'N/url',
    'N/file',
    'N/search',
    'N/error',
    'N/record',
    'N/format',
    'N/email',
    './AFON_TGS_BP_CONSTANTS',
], function (config, runtime, url, file, search, error, record, format, email, Constants) {
    /**
     * Replace all occurences of a string
     */
    function replaceAll(find, replace, str) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    /**
     * Return unique array
     */
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    /**
     * Validate Email Address
     */
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    /**
     * Get Feature of Account
     */
    function getFeatures() {
        var objFeatures = {
            bOneWorld: runtime.isFeatureInEffect({feature: 'subsidiaries'}),
            bMultiLocation: runtime.isFeatureInEffect({feature: 'multilocinvt'}),
        };
        return objFeatures;
    }
    /**
     * Get Non Elimination Subsidiaries
     */

    function getNonElimSubsidiaries() {
        var arrSubsidiaries = [];
        var objSearch = search.create({
            type: 'subsidiary',
            columns: ['name', 'internalid'],
            filters: ['iselimination', 'is', 'F'],
        });

        objSearch.run().each(function (result) {
            arrSubsidiaries.push({value: result.id, text: result.getValue({name: 'name'})});
            return true;
        });
        return arrSubsidiaries;
    }

    function getLocation(stSub) {
        var arrSubsidiaries = [];

        var arrFilterExpr = [];
        arrFilterExpr.push([['isinactive', 'is', 'F']]);
        arrFilterExpr.push('AND');
        arrFilterExpr.push([['subsidiary', 'anyof', [stSub]]]);
        var objSearch = search.create({
            type: 'location',
            columns: ['name', 'internalid'],
            filters: arrFilterExpr,
        });

        objSearch.run().each(function (result) {
            arrSubsidiaries.push({value: result.id, text: result.getValue({name: 'name'})});
            return true;
        });
        return arrSubsidiaries;
    }
    function getDepartment(stSub) {
        var arrSubsidiaries = [];

        var arrFilterExpr = [];
        arrFilterExpr.push([['isinactive', 'is', 'F']]);
        arrFilterExpr.push('AND');
        arrFilterExpr.push([['subsidiary', 'anyof', [stSub]]]);
        var objSearch = search.create({
            type: 'department',
            columns: ['name', 'internalid'],
            filters: arrFilterExpr,
        });

        objSearch.run().each(function (result) {
            arrSubsidiaries.push({value: result.id, text: result.getValue({name: 'name'})});
            return true;
        });
        return arrSubsidiaries;
    }

    function getClassification(stSub) {
        var arrSubsidiaries = [];

        var arrFilterExpr = [];
        arrFilterExpr.push([['isinactive', 'is', 'F']]);
        arrFilterExpr.push('AND');
        arrFilterExpr.push([['subsidiary', 'anyof', [stSub]]]);
        var objSearch = search.create({
            type: 'classification',
            columns: ['name', 'internalid'],
            filters: arrFilterExpr,
        });

        objSearch.run().each(function (result) {
            arrSubsidiaries.push({value: result.id, text: result.getValue({name: 'name'})});
            return true;
        });
        return arrSubsidiaries;
    }
    function getCompanyDate() {
        var currentDateTime = new Date();
        var companyTimeZone = config
            .load({type: config.Type.COMPANY_INFORMATION})
            .getText({fieldId: 'timezone'});
        var timeZoneOffSet =
            companyTimeZone.indexOf('(GMT)') == 0
                ? 0
                : Number(
                      companyTimeZone
                          .substr(4, 6)
                          .replace(/\+|:00/gi, '')
                          .replace(/:30/gi, '.5')
                  );
        var UTC = currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000;
        var companyDateTime = UTC + timeZoneOffSet * 60 * 60 * 1000;

        return new Date(companyDateTime);
    }

    /**
     * Return true if object is empty
     */
    function isEmpty(value) {
        if (
            value == null ||
            value == 'null' ||
            value == undefined ||
            value == 'undefined' ||
            value == '' ||
            value == '' ||
            value.length <= 0
        ) {
            return true;
        }
        return false;
    }
    /**
     * Return array with non empty literals
     */
    function onlyNonEmpty(e) {
        if (!isEmpty(e)) return e;
    }
    /**
     * Get script internal ID
     */
    function getScriptInternalId(scriptId) {
        var intInternalId = '';
        var objScriptSearch = search
            .create({
                type: 'script',
                columns: ['scriptfile'],
                filters: ['scriptid', 'is', scriptId],
            })
            .run();
        var searchRange = objScriptSearch.getRange(0, 1);
        if (searchRange) {
            intInternalId = searchRange[0].getValue('scriptfile');
        }

        return intInternalId;
    }

    function findCurrency(stCurrency) {
        try {
            var arrCols = [];

            var arrFilterExpr = [];
            arrFilterExpr.push([['symbol', 'is', [stCurrency]]]);
            var objSearchResult = search
                .create({
                    type: 'currency',
                    filters: arrFilterExpr,
                    columns: arrCols,
                })
                .run()
                .getRange({
                    start: 0,
                    end: 1000,
                });
            for (var i = 0; i < objSearchResult.length; i++) {
                return objSearchResult[i].id;
            }
        } catch (err) {
            log.error('findcurr err', err.toString());
        }
    }
    function parseDateString(ds) {
        var year = ds.substring(0, 4);
        var month = ds.substring(4, 6);
        var day = ds.substring(6, 8);

        return new Date(year, parseInt(month) - 1, day, null, null, null);
    }
    function findAccount(stCode) {
        try {
            var arrCols = [];

            var arrFilterExpr = [];
            arrFilterExpr.push([[Constants.OTHER_FIELDS.RMS_GL_CODE, 'is', [stCode]]]);
            var objSearchResult = search
                .create({
                    type: 'account',
                    filters: arrFilterExpr,
                    columns: ['internalid'],
                })
                .run()
                .getRange({
                    start: 0,
                    end: 1000,
                });
            for (var i = 0; i < objSearchResult.length; i++) {
                return objSearchResult[i].id;
            }
        } catch (err) {
            log.error('findAccount err', err.toString());
        }
    }
    function findSubsidiary(stCode) {
        try {
            var arrCols = [];

            var arrFilterExpr = [];
            arrFilterExpr.push([[Constants.OTHER_FIELDS.RMS_COMPANY_CODE, 'is', [stCode]]]);
            var objSearchResult = search
                .create({
                    type: 'subsidiary',
                    filters: arrFilterExpr,
                    columns: ['internalid', 'tranprefix'],
                })
                .run()
                .getRange({
                    start: 0,
                    end: 1000,
                });
            for (var i = 0; i < objSearchResult.length; i++) {
                return objSearchResult[i];
            }
        } catch (err) {
            log.error('findcurr err', err.toString());
        }
    }

    function getAllBills(options, context) {
        log.error('getAllBills', JSON.stringify(context.request.parameters));
        var stBPrec =
            context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.BP_RECORD];
        log.error('stBPrec: ' + stBPrec, '');
        var arrFilterExpr = [];
        if (!isEmpty(stBPrec)) {
            var objBPRec = record.load({
                type: Constants.BILLPAYMENT_PROCESS.ID,
                id: stBPrec,
            });
            var objData = objBPRec.getValue(Constants.BILLPAYMENT_PROCESS.FIELDS.Data);
            var arrSelected = JSON.parse(objData);
            var arrTrans = [];
            for (var i = 0; i < arrSelected.length; i++) {
                arrTrans.push(arrSelected[i].id);
            }

            if (!isEmpty(arrTrans)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['internalid', 'anyof', arrTrans]]);
            }
            log.error('stBPrec: ' + stBPrec, JSON.stringify(arrTrans));
        }
        if (
            !isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID])
        ) {
            var stCase =
                "formulanumeric: case when ({recordtype}='vendorbill' OR {recordtype}='vendorcredit' )AND {vendor.internalid} = " +
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID] +
                ' then 1' +
                "when  ({recordtype}!='vendorbill' AND {recordtype}!='vendorcredit' AND {recordtype}!='expensereport' )then 1 else 0 end";

            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([[stCase, 'equalto', '1']]);
            /**
             arrFilterExpr.push([
             [
             'name',
             'anyof',
             [
             context.request.parameters[
             Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID
             ],
             ],
             ],
             ]);*/
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_TYPE_ID]
            )
        ) {
            var stVendorType =
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_TYPE_ID];
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            var stCase = '';

            if (Math.abs(stVendorType) == 8) {
                stCase =
                    "formulanumeric: case when ({recordtype}='expensereport'  )" +
                    ' then 1' +
                    ' else 0 end';
            } else {
                stCase =
                    "formulanumeric: case when ({recordtype}='vendorbill' OR {recordtype}='vendorcredit' )AND {vendorline.category.id} = '" +
                    stVendorType +
                    "' then 1" +
                    "when  ({recordtype}!='vendorbill' AND {recordtype}!='vendorcredit' AND {recordtype}!='expensereport' )then 1 else 0 end";
            }
            arrFilterExpr.push([[stCase, 'equalto', '1']]);
            /**
             arrFilterExpr.push([
             [
             'vendorLine.category',
             'anyof',
             [
             context.request.parameters[
             Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_TYPE_ID
             ],
             ],
             ],
             ]);*/
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.SUBSIDIARY_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'subsidiary',
                    search.Operator.IS,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.SUBSIDIARY_ID
                    ],
                ],
            ]);
        } else {
            if (isEmpty(stBPrec)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['subsidiary', search.Operator.IS, 3]]);
            }
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.CURRENCY_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'currency',
                    search.Operator.IS,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.CURRENCY_ID
                    ],
                ],
            ]);
        } else {
            if (isEmpty(stBPrec)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['currency', search.Operator.IS, 1]]);
            }
        }

        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_FROM_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'custbody_document_date',
                    search.Operator.ONORAFTER,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_FROM_ID
                    ],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_TO_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'custbody_document_date',
                    search.Operator.ONORBEFORE,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_TO_ID
                    ],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'duedate',
                    search.Operator.ONORAFTER,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                    ],
                ],
                'OR',
                [
                    [
                        'trandate',
                        search.Operator.ONORAFTER,
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                        ],
                    ],
                    'AND',
                    ['type', 'anyof', ['VendCred', 'ExpRept']],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'duedate',
                    search.Operator.ONORBEFORE,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID
                    ],
                ],
                'OR',
                [
                    [
                        'trandate',
                        search.Operator.ONORBEFORE,
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID
                        ],
                    ],
                    'AND',
                    ['type', 'anyof', ['VendCred', 'ExpRept']],
                ],
            ]);
        }
        /**
         if (
         !isEmpty(
         context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.REFERENCE_ID]
         )
         ) {
            var stRef =
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.REFERENCE_ID];
            stRef = stRef.trim();
            var arrStr = stRef.split(',');

            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            var objAllFilter = [];
            //['type', 'anyof', ['CustInvc']]

            objAllFilter.push(['type', 'anyof', ['CustInvc']]);
            objAllFilter.push('OR');
            var arrRefFilter = [];
            if (arrStr.length == 1) {
                objAllFilter.push(['numbertext', 'contains', arrStr[0].trim()]);
                arrFilterExpr.push(objAllFilter);
            } else {
                for (var i = 0; i < arrStr.length; i++) {
                    arrRefFilter.push(['numbertext', 'contains', arrStr[i].trim()]);
                    if (i != arrStr.length - 1) {
                        arrRefFilter.push('OR');
                    }
                }
                objAllFilter.push(arrRefFilter);
                arrFilterExpr.push(objAllFilter);
            }
        }*/

        if (!isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.AR_ID])) {
            var stCase =
                "formulanumeric: CASE WHEN {recordtype}='invoice' AND {customer.custentity_afon_tgs_linkedcode} IS NOT NULL THEN 1 ELSE 0 end";

            if (
                !isEmpty(
                    context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID]
                )
            )
                stCase =
                    "formulanumeric: CASE WHEN {recordtype}='invoice' AND {customer.custentity_afon_tgs_linkedcode.id} =" +
                    context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID] +
                    ' THEN 1 ELSE 0 end';

            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            var arrAP = [['type', 'anyof', ['VendBill', 'VendCred', 'ExpRept']]];

            arrFilterExpr.push([arrAP, 'OR', [stCase, 'equalto', '1']]);
        } else {
            if (isEmpty(stBPrec)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['type', 'anyof', ['VendBill', 'VendCred', 'ExpRept']]]);
            }
        }
        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['mainline', search.Operator.IS, 'T']]);

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['memorized', search.Operator.IS, 'F']]);

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['name', 'noneof', ['@NONE@']]]);
        var stCase =
            "formulanumeric: CASE WHEN ({status}='Pending Approval' OR {status}='Rejected' OR {status}='Paid In Full'  OR {status}='Fully Applied' OR {status}='Void') THEN 0 ELSE 1 end";

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([[stCase, 'equalto', '1']]);
        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['fxamountremaining', 'greaterthan', '0']]);
        if (isEmpty(stBPrec)) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    Constants.BILLPAYMENT_MATCH.FIELDS.Transaction +
                        '.' +
                        Constants.BILLPAYMENT_MATCH.FIELDS.Bill,
                    'anyof',
                    ['@NONE@'],
                ],
            ]);
        }

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['posting', 'is', ['T']]]);

        //if (isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.AR_ID])) {
        if (arrFilterExpr.length > 0) {
            var stCase =
                "formulanumeric: CASE WHEN ({recordtype}='vendorbill' OR {recordtype}='expensereport' ) AND {custbody_9997_is_for_ep_eft} = 'T' THEN 1 when ({recordtype} !='vendorbill' AND  {recordtype} !='expensereport')then 1 ELSE 0 end";
            arrFilterExpr.push('AND');
            arrFilterExpr.push([[stCase, 'equalto', '1']]);
        }
        //}

        if (isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.AR_ID])) {
            if (arrFilterExpr.length > 0) {
                var stCase =
                    "formulanumeric:  CASE WHEN {recordtype} = 'journalentry' AND {accounttype} = 'Accounts Payable' THEN 0 when {recordtype} !='journalentry' then 1 ELSE 0 end";
                arrFilterExpr.push('AND');
                arrFilterExpr.push([[stCase, 'equalto', '1']]);
            }
        }
        var objSearch = search.create({
            type: 'transaction',
            filters: arrFilterExpr,
            columns: [
                {
                    name: 'formulatext',
                    sort: search.Sort.ASC,
                    formula:
                        "case when {recordtype}= 'invoice' then {customer.companyname} when {recordtype}='expensereport' then {employee.altname} else {vendor.companyname} end",
                },
                'name',

                /**{
                    name: 'name',
                    sort: search.Sort.DESC,
                },
                 {
                    name: 'recordtype',
                    sort: search.Sort.DESC,
                },
                 {
                    name: 'trandate',
                    sort: search.Sort.DESC,
                },*/
                'recordtype',
                'trandate',
                'vendor.companyname',
                'accounttype',
                'transactionnumber',
                'entity',
                'custbody_9997_is_for_ep_eft',
                'amount',
                'account',
                'tranid',
                Constants.BODY_FIELDS.EXP_REF,
                'fxamountremaining',
                'subsidiarynohierarchy',
                'internalid',
                'duedate',
                Constants.BODY_FIELDS.RMS_DOC_NO,
                'exchangerate',
                'fxamount',
                'currency',
                'otherrefnum',
                'name',
                'vendor.companyname',
                'vendor.entityid',
                'vendor.altname',
                'employee.entityid',
                'employee.altname',
                'customer.' + Constants.ENTITY_FIELDS.LINK_CODE,
                'customer.companyname',
                'customer.entityid',
                'custbody_document_date',
            ],
        });
        objSearch.isPublic = true;
        objSearch.title = ' all Search ' + new Date().getTime();
        // objSearch.save();
        return objSearch;
    }

    function getAllBills1(options, context) {
        var arrFilterExpr = [];
        var stBPrec =
            context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.BP_RECORD];
        log.error('stBPrec: ' + stBPrec, '');
        if (!isEmpty(stBPrec)) {
            var objBPRec = record.load({
                type: Constants.BILLPAYMENT_PROCESS.ID,
                id: stBPrec,
            });
            var arrData = objBPRec.getValue(Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRAN_SELECTED);
            arrData = JSON.parse(arrData);
            var arrTrans = [];
            for (var i = 0; i < arrData.length; i++) {
                arrTrans.push(arrData[i]);
            }

            if (!isEmpty(arrTrans)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['internalid', 'anyof', arrTrans]]);
            }
            log.error('stBPrec: ' + stBPrec, JSON.stringify(arrTrans));
        }
        if (
            !isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID])
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'name',
                    'anyof',
                    [
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_ID
                        ],
                    ],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_TYPE_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'vendorLine.category',
                    'anyof',
                    [
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.VENDOR_TYPE_ID
                        ],
                    ],
                ],
            ]);
        }

        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.CURRENCY_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'currency',
                    search.Operator.IS,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.CURRENCY_ID
                    ],
                ],
            ]);
        } else {
            if (isEmpty(stBPrec)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([['currency', search.Operator.IS, 1]]);
            }
        }

        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_FROM_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'trandate',
                    search.Operator.ONORAFTER,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_FROM_ID
                    ],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_TO_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'trandate',
                    search.Operator.ONORBEFORE,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.TRANS_DATE_TO_ID
                    ],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[
                    Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                ]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'duedate',
                    search.Operator.ONORAFTER,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                    ],
                ],
                'OR',
                [
                    [
                        'trandate',
                        search.Operator.ONORAFTER,
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_FROM_ID
                        ],
                    ],
                    'AND',
                    ['type', 'anyof', ['VendCred', 'Journal', 'ExpRept']],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID]
            )
        ) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    'duedate',
                    search.Operator.ONORBEFORE,
                    context.request.parameters[
                        Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID
                    ],
                ],
                'OR',
                [
                    [
                        'trandate',
                        search.Operator.ONORBEFORE,
                        context.request.parameters[
                            Constants.HC_PAYMENT_LISTING_FORM.FIELDS.DUE_DATE_TO_ID
                        ],
                    ],
                    'AND',
                    ['type', 'anyof', ['VendCred', 'Journal', 'ExpRept']],
                ],
            ]);
        }
        if (
            !isEmpty(
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.REFERENCE_ID]
            )
        ) {
            var stRef =
                context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.REFERENCE_ID];
            stRef = stRef.trim();
            var arrStr = stRef.split(',');

            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            var objAllFilter = [];
            //['type', 'anyof', ['CustInvc']]

            objAllFilter.push(['type', 'anyof', ['CustInvc']]);
            objAllFilter.push('OR');
            var arrRefFilter = [];
            if (arrStr.length == 1) {
                objAllFilter.push(['numbertext', 'contains', arrStr[0].trim()]);
                arrFilterExpr.push(objAllFilter);
            } else {
                for (var i = 0; i < arrStr.length; i++) {
                    arrRefFilter.push(['numbertext', 'contains', arrStr[i].trim()]);
                    if (i != arrStr.length - 1) {
                        arrRefFilter.push('OR');
                    }
                }
                objAllFilter.push(arrRefFilter);
                arrFilterExpr.push(objAllFilter);
            }
        }

        if (!isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.AR_ID])) {
            var stCase =
                "formulanumeric: CASE WHEN {recordtype}='invoice' AND {customer.custentity_afon_tgs_linkedcode} IS NOT NULL THEN 1 ELSE 0 end";

            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            var arrAP = [['type', 'anyof', ['VendBill', 'VendCred', 'Journal', 'ExpRept']]];

            arrFilterExpr.push([arrAP, 'OR', [stCase, 'equalto', '1']]);
        } else {
            if (isEmpty(stBPrec)) {
                if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
                arrFilterExpr.push([
                    ['type', 'anyof', ['VendBill', 'VendCred', 'Journal', 'ExpRept']],
                ]);
            }
        }
        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['mainline', search.Operator.IS, 'T']]);

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['memorized', search.Operator.IS, 'F']]);

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['name', 'noneof', ['@NONE@']]]);
        var stCase =
            "formulanumeric: CASE WHEN ({status}='Pending Approval' OR {status}='Rejected' OR {status}='Paid In Full'  OR {status}='Fully Applied' OR {status}='Void') THEN 0 ELSE 1 end";

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([[stCase, 'equalto', '1']]);
        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['fxamountremaining', 'greaterthan', '0']]);
        if (isEmpty(stBPrec)) {
            if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
            arrFilterExpr.push([
                [
                    Constants.BILLPAYMENT_MATCH.FIELDS.Transaction +
                        '.' +
                        Constants.BILLPAYMENT_MATCH.FIELDS.Bill,
                    'anyof',
                    ['@NONE@'],
                ],
            ]);
        }

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['posting', 'is', ['T']]]);

        //if (isEmpty(context.request.parameters[Constants.HC_PAYMENT_LISTING_FORM.FIELDS.AR_ID])) {
        if (arrFilterExpr.length > 0) {
            var stCase =
                "formulanumeric: CASE WHEN ({recordtype}='vendorbill' OR {recordtype}='expensereport' )AND {custbody_9997_is_for_ep_eft} = 'T' THEN 1 when ({recordtype}!='vendorbill' AND {recordtype}!='expensereport' ) then 1 ELSE 0 end";
            arrFilterExpr.push('AND');
            arrFilterExpr.push([[stCase, 'equalto', '1']]);
        }
        //}
        var objSearch = search.create({
            type: 'transaction',
            filters: arrFilterExpr,
            columns: [
                {
                    name: 'name',
                    sort: search.Sort.DESC,
                },
                {
                    name: 'recordtype',
                    sort: search.Sort.DESC,
                },
                {
                    name: 'trandate',
                    sort: search.Sort.DESC,
                },
                'vendor.companyname',
                'transactionnumber',
                'entity',
                'custbody_9997_is_for_ep_eft',
                'amount',
                'account',
                'tranid',
                'amountremaining',
                'fxamountremaining',
                'subsidiarynohierarchy',
                'internalid',
                'duedate',
                'amountpaid',
                'exchangerate',
                'fxamount',
                'currency',
                'otherrefnum',
                'name',
                'vendor.companyname',
                'vendor.entityid',
                'vendor.altname',
                'employee.entityid',
                'employee.altname',
                'customer.' + Constants.ENTITY_FIELDS.LINK_CODE,
                'customer.companyname',
                'customer.entityid',
            ],
        });
        objSearch.isPublic = true;
        objSearch.title = ' all Search ' + new Date().getTime();
        //objSearch.save();
        return objSearch;
    }

    function getTransactionInfo(options) {
        var arrFilterExpr = [];
        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['internalid', 'anyof', options.ids]]);

        if (arrFilterExpr.length > 0) arrFilterExpr.push('AND');
        arrFilterExpr.push([['mainline', search.Operator.IS, 'T']]);
        if (arrFilterExpr.length > 0) {
            var stCase =
                "formulanumeric:  CASE WHEN {recordtype} = 'journalentry' AND {accounttype} = 'Accounts Payable' THEN 1 when {recordtype} !='journalentry' then 1 ELSE 0 end";
            arrFilterExpr.push('AND');
            arrFilterExpr.push([[stCase, 'equalto', '1']]);
        }
        var objSearch = search.create({
            type: 'transaction',
            filters: arrFilterExpr,
            columns: [
                {
                    name: 'name',
                    sort: search.Sort.DESC,
                },
                {
                    name: 'recordtype',
                    sort: search.Sort.DESC,
                },
                {
                    name: 'trandate',
                    sort: search.Sort.DESC,
                },
                'vendor.companyname',
                'transactionnumber',
                'entity',
                'custbody_9997_is_for_ep_eft',
                'amount',
                'account',
                'tranid',
                'amountremaining',
                'fxamountremaining',
                'subsidiarynohierarchy',
                'subsidiary',
                'internalid',
                'duedate',
                'amountpaid',
                'exchangerate',
                'fxamount',
                'currency',
                'otherrefnum',
                'status',
                'name',
                'vendor.companyname',
                'vendor.entityid',
                'vendor.altname',
                'employee.entityid',
                'employee.altname',
                'customer.' + Constants.ENTITY_FIELDS.LINK_CODE,
                'customer.companyname',
                'customer.entityid',
            ],
        });
        objSearch.isPublic = true;
        objSearch.title = 'Search ' + new Date().getTime();
        //objSearch.save();
        return objSearch;
    }
    function numberWithCommas(x) {
        if (isEmpty(x)) {
            log.error('empty', x);
            x = '0.00';
            return x;
        }

        if (parseFloat(x) == 0) {
            x = '0.00';
            return x;
        }
        if (x) {
            return parseFloat(x)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return x;
        //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function getAllBankAccount() {
        var bankSearch = search
            .create({
                type: 'customrecord_2663_bank_details',
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecord_2663_eft_template', 'noneof', '@NONE@'],
                ],
                columns: [
                    {
                        name: 'internalid',
                        sort: search.Sort.ASC,
                    },
                    'name',
                ],
            })
            .run()
            .getRange({
                start: 0,
                end: 1000,
            });
        return bankSearch;
    }
    return {
        isEmpty: isEmpty,
        getAllBankAccount: getAllBankAccount,
        getNonElimSubsidiaries: getNonElimSubsidiaries,
        validateEmail: validateEmail,
        getFeatures: getFeatures,
        replaceAll: replaceAll,
        onlyUnique: onlyUnique,
        getScriptInternalId: getScriptInternalId,
        getCompanyDate: getCompanyDate,
        findCurrency: findCurrency,
        findSubsidiary: findSubsidiary,
        findAccount: findAccount,
        parseDateString: parseDateString,
        getAllBills: getAllBills,
        getAllBills1: getAllBills1,
        numberWithCommas: numberWithCommas,
        getTransactionInfo: getTransactionInfo,
        getClassification: getClassification,
        getLocation: getLocation,
        getDepartment: getDepartment,
    };
});
