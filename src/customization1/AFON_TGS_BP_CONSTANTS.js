/**
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 * @NApiVersion 2.0
 * @NModuleScope Public
 */

define([], function () {
    return {
        TEST: {
            test: ''
        },
        IMAGES: {
            PLUS_IMG: 3165,
            MINUS_IMG: 3166,
        },
        SEARCH: {
            BP_TRANS: 'customsearch_afon_bptrans',
        },
        BILLPAYMENT_PROCESS: {
            ID: 'customrecord_afon_tgs_bprecordprocess',
            FIELDS: {
                Data: 'custrecord_afon_tgs_data',
                Date: 'custrecord_afon_tgs_bpdate',
                RefNo: 'custrecord_afon_tgs_refno',
                Status: 'custrecord_afon_tgs_bpstatus',
                BankFile: 'custrecord_afon_tgs_bankfile',
                IsBeingProcessed: 'custrecord_afon_tgs_beingprocessed',
                Rejected: 'custrecord_afon_tgs_bp_rejected',
                IsDelete: 'custrecord_afon_tgs_delete',
                ACCOUNT: 'custrecord_afon_tgs_bankaccount',
                GL_ACCOUNT: 'custrecord_afon_tgs_glaccount',
                CURRENCY: 'custrecord_afon_tgs_bp_currency',
                FINAL_DATA: 'custrecord_afon_tgs_finaldata',
                ERROR: 'custrecord_afon_tgs_bperror',
                DEPT: 'custrecord_afon_tgs_dept',
                BU: 'custrecord_afon_tgs_bu',
                LOCATION: 'custrecord_afon_tgs_location',
                CREATEDBY: 'custrecord_afon_tgs_bpcreatedby',
                GIRO: 'custrecord_afon_tgs_giroref',
                SETGIRO: 'custrecord_afon_setgiro',
                BCREATEBANKFILE: 'custrecord_afon_bfile_create',
            },
        },
        BILLPAYMENT_MATCH: {
            ID: 'customrecord_afon_tgs_bpmatching',
            FIELDS: {
                Transaction: 'custrecord_afon_tgs_transaction',
                Bill: 'custrecord_afon_tgs_bprecord',
                AMOUNT: 'custrecord_afon_bp_amt',
            },
        },
        HC_PAYMENT_LISTING_FORM: {
            TITLE: 'Bills Payment Page',
            FIELDS: {
                SELECTED_ID: 'custpage_selected',
                BP_RECORD: 'custpage_bprecord',
                TRANS_DATE_FROM_ID: 'custpage_datefrom_id',
                TRANS_DATE_FROM_LBL: 'From Date (Transaction Date)',
                TRANS_DATE_TO_ID: 'custpage_dateto_id',
                TRANS_DATE_TO_LBL: 'To Date (Transaction Date',
                DUE_DATE_FROM_ID: 'custpage_duedatefrom_id',
                DUE_DATE_FROM_LBL: 'From Date (Due Date)',
                DUE_DATE_TO_ID: 'custpage_duedateto_id',
                DUE_DATE_TO_LBL: 'To Date (Due Date)',
                SUBSIDIARY_ID: 'custpage_subsidiary_id',
                SUBSIDIARY_TXT_ID: 'custpage_subtxt_id',
                GLACCOUNT_TXT_ID: 'custpage_glaccounttxt_id',
                GLACCOUNT_ID: 'custpage_glaccount_id',
                CURRENCY_TXT_ID: 'custpage_currencytxt_id',
                SUBSIDIARY_LBL: 'Subsidiary',
                PAYMENT_CURRENCY_ID: 'custpage_paymentcurrency_id',
                PAYMENT_CURRENCY_LBL: 'Payment Currency',
                DISPLAY_TRANSACTION_ID: 'custpage_displaymode_id',
                DISPLAY_TRANSACTION_LBL: 'Display Transactions',
                VENDOR_TYPE_ID: 'custpage_vendortype_id',
                VENDOR_TYPE_LBL: 'Vendor Type',
                CUSTOMER_ID: 'custpage_vendortype_id',
                AR_ID: 'custpage_ar',
                REFERENCE_ID: 'custpage_reference',
                OFFSET_ID: 'custpage_offset',
                VENDOR_ID: 'custpage_vendor',
                VENDOR_TYPE_ID: 'custpage_vendor_type',
                CURRENCY_ID: 'custpage_currency',
                PAYMENT_DATE_ID: 'custpage_value_date',
                CUSTOMER_LBL: 'Customer',
                CURRENTPAGE_ID: 'custpage_currentpage',
                COUNT_ID: 'custpage_count',
                ACTION_ID: 'custpage_action',
                REFNO_ID: 'custpage_refno',
                BANK_ID: 'custpage_bankacct',
                DEPT_ID: 'custpage_deptid',
                CLASS_ID: 'custpage_classid',
                LOCATION_ID: 'custpage_locationid',
                AMT_SELECTED: 'custpage_totalamtsel',
                ENTITY_SELECTED: 'custpage_totalentsel',
                TRAN_SELECTED: 'custpage_alltransel',
            },
            BUTTONS: {
                EXPORT_ID: 'custpage_export',
                EXPORT_FXN: 'openWindow()',
            },
            SUBLIST: {
                RESULT: 'custpage_result',
            },
        },
        HC_OTHERS: {
            MAX_USAGE_LIMIT: 1000,
            TABLE_TREE:
                '<style type="text/css">' +
                '  table#lot2 { font-size: 120% !important; border-collapse: collapse; border: #E5E5E5 1px solid;}' +
                'table#lot2 th { background-color: #E5E5E5 !important; text-transform: uppercase; padding: 5px; padding-left: 8px}' +
                'table#lot2 td { border: none !important; border-bottom: 1px solid #EBEBEB !important; padding: 5px;}' +
                'table#lot2 tr:hover { background-color: #fffff2; }' +
                '.btnEnabled:link, .btnEnabled:visited, .btnEnabled:active {font-size: 14px !important; font-weight: 600; padding: 3px 12px !important; background-color: #f5f5f5; margin-right: 15px; margin-bottom: 40px; border-radius: 3px; border: 1px solid #999999 !important; text-decoration: none; line-height: 50px !important;}.btnEnabled:hover {background-color: #e4e4e4}' +
                '#btnDisabled:link, #btnDisabled:visited, #btnDisabled:active {color: #5d5d5d; font-size: 14px !important; font-weight: 600; padding: 3px 12px !important; background-color: #e4e4e4; margin-right: 15px; margin-bottom: 40px; border-radius: 3px; border: 1px solid #999999 !important; text-decoration: none; line-height: 50px !important;}#btnDisabled:hover {cursor: default;}' +
                '</style>',

            BUTTON_CSS:
                '<style type="text/css">' +
                '  table#lot2 { font-size: 120% !important; border-collapse: collapse; border: #E5E5E5 1px solid;}' +
                'table#lot2 th { background-color: #E5E5E5 !important; text-transform: uppercase; padding: 5px; padding-left: 8px}' +
                'table#lot2 td { border: none !important; border-bottom: 1px solid #EBEBEB !important; padding: 5px;}' +
                'table#lot2 tr:hover { background-color: #fffff2; }' +
                '#btnEnabled {font-size: 14px !important; font-weight: 600; background-color: #f5f5f5; border-radius: 4px; border: 1px solid #999999 !important; }' +
                '</style>',
            BPSEARCH:
                '/app/common/search/searchresults.nl?searchtype=Transaction&style=NORMAL&report=&grid=&searchid=781&Transaction_INTERNALID=',
        },
        PREFERENCES: {
            COGS: 'custscript_afon_2c2p_eba_cogs',
        },
        OTHER_FIELDS: {
            RMS_COMPANY_CODE: 'custrecord_afon_tgs_companycode',
            RMS_LOC_CODE: 'custrecord_afon_tgs_loccode',
            RMS_TAX_CODE: 'custrecord_afon_tgs_taxcode',
            RMS_GL_CODE: 'custrecord_afon_tgs_rmsglcode',
            DEFAULT_GL: 1087,
        },
        ENTITY_FIELDS: {
            LINK_CODE: 'custentity_afon_tgs_linkedcode',
        },
        BODY_FIELDS: {
            CREATED_FROM_SCRIPT: 'custbody_afon_2c2p_eba_createdfromscri',
            API: 'custbody_afon_2c2p_eba_api',
            EBA_SYNC: 'custbody_afon_2c2p_eba_syncid',
            DOCUMENT_DATE: 'custbody_afon_tgs_docdate',
            RMS_DOC_NO: 'custbody_afon_tgs_rms_doc_no',
            EXP_REF: 'custbody_af_expreportreference',
            BP_BATCH: 'custbody_afon_tgs_bpbatch',
        },
        LINE_FIELDS: {
            DEFERRED_REVENUE: 'custcol_afon_2c2p_eba_po_def_rev',
            TXN_NO: 'custcol_afon_2c2p_txn_no',
            TPV: 'custcol_afon_2c2p_tpv',
        },
        RMS_DEPT_BU_MAP: {
            ID: 'customrecord_afon_tgs_dept_bumapping',
            FIELDS: {
                RMS_COMPANY_CODE: 'custrecord_afon_2c2p_eba_datefrom',
                RMS_CODE: 'custrecord_afon_2c2p_eba_dateto',
                NS_DEPT: 'custrecord_afon_2c2p_eba_api',
                NS_BU: 'custrecord_afon_2c2p_eba_request',
            },
        },
        SCRIPT: {
            CS_BP: 'customscript_afon_tgs_cs_bpayment',
            SS_ProcessBP: 'customscript_afon_tgs_ss_process_bppayre',
            SS_ProcessBP_Param: 'custscript_afon_tgs_bpoptions',
            GIRO: 'custscript_afon_tgs_giro',
            MR_ProcessBP: 'customscript_afon_tgs_mr_bpayment',
            MR_ProcessBP_option: 'custscript_afon_tgs_mrbpoption',
            MR_ProcessBP_user: 'custscript_afon_tgs_mrbpuser',
            MR_ProcessBP_stat: 'custscript_afon_tgs_bpstat',
            MR_ProcessBP_olddata: 'custscript_afon_tgs_olddata',
            SL_BP: 'customscript_afon_tgs_sl_bpayment',
            SL_BP_DEPLOY: 'customdeploy_afon_tgs_sl_bpayment',
        },
    };
});
