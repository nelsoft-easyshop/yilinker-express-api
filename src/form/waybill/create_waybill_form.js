'use strict';

var Checkit = require('checkit');

var errorCodes = module.exports.errorCodes = {
    consignee_address: {
        required: '1000',
        complete_address: {
            required: '1001',
            maxLength: '1002',
            string: '1003'
        },
        province: {
            required: '1004',
            maxLength: '1005',
            string: '1006'
        },
        city: {
            required: '1007',
            maxLength: '1008',
            string: '1009'
        },
        barangay: {
            required: '1010',
            maxLength: '1011',
            string: '1012'
        },
        street_address: {
            required: '1013',
            maxLength: '1014',
            string: '1015',
        }
    },
    consignee_name: {
        required: '2000',
        maxLength: '2001',
        string: '2002'
    },
    consignee_contact_number: {
        required: '3000',
        maxLength: '3001',
        string: '3002'
    },
    is_cod: {
        required: '4000',
        boolean: '4001'
    },
    amount_to_collect: {
        required: '4010',
        maxLength: '4011',
        number: '4012'
    },
    reference_number: {
        maxLength: '5001',
        string: '5002'
    },
    declared_value: {
        required: '6000',
        maxLength: '6001',
        number: '6002'
    },
    package_description: {
        required: '7000',
        maxLength: '7001',
        string: '7002'
    },
    api_address: {
        required: '8000'
    },
    callback_url: {
        required: '9000',
        maxLength: '9001',
        string: '9002',
        url: '9003'
    }
};

module.exports.form = new Checkit({
    consignee_address: [
        { rule: 'required',         message: errorCodes.consignee_address.required                      }
    ],
    consignee_name: [
        { rule: 'required',         message: errorCodes.consignee_name.required                         },
        { rule: 'string',           message: errorCodes.consignee_name.string                           },
        { rule: 'maxLength:150',    message: errorCodes.consignee_name.maxLength                        }
    ],
    consignee_contact_number: [
        { rule: 'required',         message: errorCodes.consignee_contact_number.required               },
        { rule: 'string',           message: errorCodes.consignee_contact_number.string                 },
        { rule: 'maxLength:150',    message: errorCodes.consignee_contact_number.maxLength              }
    ],
    declared_value: [
        { rule: 'required',         message: errorCodes.declared_value.required                         },
        { rule: function(val){
            var dec = (val + '').split('.');
            if(dec[0].length > 11 || (dec[1] || '').length > 2){
                throw new Error(errorCodes.declared_value.maxLength);
            }
        }                                                                                               },
        { rule: 'number',           message: errorCodes.declared_value.number                           }
    ],
    is_cod: [
        { rule: 'required',         message: errorCodes.is_cod.required                                 },
        { rule: 'boolean',          message: errorCodes.is_cod.boolean                                  }
    ],
    package_description: [
        { rule: 'required',         message: errorCodes.package_description.required                    },
        { rule: 'string',           message: errorCodes.package_description.string                      },
        { rule: 'maxLength:500',    message: errorCodes.package_description.maxLength                   }
    ]
})
.maybe({reference_number: [
        { rule: 'string',           message: errorCodes.reference_number.string                         },
        { rule: 'maxLength:50',     message: errorCodes.reference_number.maxLength                      }
    ]}, 
    function(form){
        return form.hasOwnProperty('reference_number');
})
.maybe({callback_url: [
        { rule: 'required',         message: errorCodes.callback_url.required                            },
        { rule: 'string',           message: errorCodes.callback_url.string                              },  
        { rule: 'maxLength:300',    message: errorCodes.callback_url.maxLength                           },
        { rule: 'url',              message: errorCodes.callback_url.url                                 }
    ]}, 
    function(form){
        return form.hasOwnProperty('callback_url');
})
.maybe({amount_to_collect: [
        { rule: 'required',         message: errorCodes.amount_to_collect.required                      },
        { rule: function(val){
            var dec = (val + '').split('.');
            if(dec[0].length > 11 || (dec[1] || '').length > 2){
                throw new Error(errorCodes.amount_to_collect.maxLength);
            }
        }                                                                                               },
        { rule: 'number',           message: errorCodes.amount_to_collect.number                        }
    ]}, 
    function(form){
        return form.is_cod;
})
.maybe({"consignee_address.complete_address": [
        { rule: 'required',         message: errorCodes.consignee_address.complete_address.required     },
        { rule: 'string',           message: errorCodes.consignee_address.complete_address.string       },
        { rule: 'maxLength:300',    message: errorCodes.consignee_address.complete_address.maxLength    }
    ]}, function(form){
        return form.hasOwnProperty('consignee_address');
})
.maybe({"consignee_address.province": [
        { rule: 'required',         message: errorCodes.consignee_address.province.required             },
        { rule: 'string',           message: errorCodes.consignee_address.province.string               },
        { rule: 'maxLength:50',    message: errorCodes.consignee_address.province.maxLength            }
    ]}, function(form){
        return form.hasOwnProperty('consignee_address');
})
.maybe({"consignee_address.city": [
        { rule: 'required',         message: errorCodes.consignee_address.city.required                 },
        { rule: 'string',           message: errorCodes.consignee_address.city.string                   },
        { rule: 'maxLength:50',     message: errorCodes.consignee_address.city.maxLength                }
    ]}, function(form){
        return form.hasOwnProperty('consignee_address');
})
.maybe({"consignee_address.barangay": [
        { rule: 'required',         message: errorCodes.consignee_address.barangay.required             },
        { rule: 'string',           message: errorCodes.consignee_address.barangay.string               },
        { rule: 'maxLength:50',     message: errorCodes.consignee_address.barangay.maxLength            }
    ]}, function(form){
        return form.hasOwnProperty('consignee_address');
})
.maybe({"consignee_address.street_address": [
        { rule: 'required',         message: errorCodes.consignee_address.street_address.required       },
        { rule: 'string',           message: errorCodes.consignee_address.street_address.string         },
        { rule: 'maxLength:150',     message: errorCodes.consignee_address.street_address.maxLength     }
    ]}, function(form){
        return form.hasOwnProperty('consignee_address');
});
