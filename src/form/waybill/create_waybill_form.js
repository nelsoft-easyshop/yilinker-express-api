'use strict';

var Checkit = require('checkit');

/*
 * ERRORS
 * parameter key - address
 * 1000 - Missing Address
 * 1001 - Invalid Address Consignee
 * 1011 - Invalid Address Shipper
 *
 * parameter key - contactPerson
 * 2000 - Missing Contact Person
 * 2001 - Invalid Contact Person
 *
 * parameter key - contactNumber
 * 3000 - Missing Contact Number
 * 3001 - Invalid Contact Number
 *
 * parameter key - isCOD
 * 4000 - Missing IS COD
 * 4001 - Invalid IS COD
 *
 * parameter key - amountToCollect
 * 4010 - Missing Amount to collect
 * 4011 - Invalid Amout to collect
 *
 * parameter key - referenceNumber
 * 5000 - Missing Reference Number
 * 5001 - Invalid Reference Number
 *
 * parameter key - declaredValue
 * 6000 - Missing Declared Value
 * 6001 - Invalid Declared Value
 *
 * parameter key - packageDescription
 * 7000 - Missing packageDescription
 * 7001 - Invalid Package Description
 */

var errorCodes = module.exports.errorCodes = {
    consignee_address: {
        required: '1000',
        maxLength: '1001',
        string: '1001'
    },
    shipper_address: {
        required: '1011',
        maxLength: '1011',
        string: '1011'
    },
    consignee_name: {
        required: '2000',
        maxLength: '2001',
        string: '2001'
    },
    consignee_contact_number: {
        required: '3000',
        maxLength: '3001',
        string: '3001'
    },
    is_cod: {
        required: '4000',
        boolean: '4001'
    },
    amount_to_collect: {
        required: '4010',
        maxLength: '4011',
        number: '4011'
    },
    reference_number: {
        maxLength: '5001',
        string: '5001'
    },
    declared_value: {
        required: '6000',
        maxLength: '6001',
        number: '6001'
    },
    package_description: {
        required: '7000',
        maxLength: '7001',
        string: '7001'
    }
};

module.exports.form = new Checkit({
    consignee_address: [
        { rule: 'required',         message: errorCodes.consignee_address.required          },
        { rule: 'maxLength:300',    message: errorCodes.consignee_address.maxLength         },
        { rule: 'string',           message: errorCodes.consignee_address.string            }
    ],
    consignee_name: [
        { rule: 'required',         message: errorCodes.consignee_name.required             },
        { rule: 'maxLength:150',    message: errorCodes.consignee_name.maxLength            },
        { rule: 'string',           message: errorCodes.consignee_name.string               }
    ],
    consignee_contact_number: [
        { rule: 'required',         message: errorCodes.consignee_contact_number.required   },
        { rule: 'maxLength:150',    message: errorCodes.consignee_contact_number.maxLength  },
        { rule: 'string',           message: errorCodes.consignee_contact_number.string     },
    ],
    declared_value: [
        { rule: 'required',         message: errorCodes.declared_value.required             },
        { rule: function(val){
            var dec = (val + '').split('.');
            if(dec[0].length > 11 || (dec[1] || '').length > 2){
                throw new Error(errorCodes.declared_value.maxLength);
            }
        }                                                                                   },
        { rule: 'number',           message: errorCodes.declared_value.number               }
    ],
    is_cod: [
        { rule: 'required',         message: errorCodes.is_cod.required                     },
        { rule: 'boolean',          message: errorCodes.is_cod.boolean                      }
    ],
    package_description: [
        { rule: 'required',         message: errorCodes.package_description.required        },
        { rule: 'maxLength:500',    message: errorCodes.package_description.maxLength       },
        { rule: 'string',           message: errorCodes.package_description.string          }
    ]
})
.maybe({reference_number: [
        { rule: 'maxLength:50',     message: errorCodes.reference_number.maxLength          },
        { rule: 'string',           message: errorCodes.reference_number.string             }
    ]}, 
    function(form){
        return form.hasOwnProperty('reference_number');
})
.maybe({shipper_address: [
        { rule: 'required',         message: errorCodes.shipper_address.required            },
        { rule: 'maxLength:300',    message: errorCodes.shipper_address.maxLength           },
        { rule: 'string',           message: errorCodes.shipper_address.string              }
    ]}, 
    function(form){
        return form.hasOwnProperty('shipper_address');
})
.maybe({amount_to_collect: [
        { rule: 'required',         message: errorCodes.amount_to_collect.required          },
        { rule: function(val){
            var dec = (val + '').split('.');
            if(dec[0].length > 11 || (dec[1] || '').length > 2){
                throw new Error(errorCodes.amount_to_collect.maxLength);
            }
        }                                                                                   },
        { rule: 'number',           message: errorCodes.amount_to_collect.number            }
    ]}, 
    function(form){
        return form.is_cod;
});
