import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { GarageDto } from "../models/entity-management-dto/garage";
import { InsuranceCompanyDto } from "../models/entity-management-dto/insurance-company";
import { FieldDTO } from "../models/field-dto";
import { FieldGroupDTO } from "../models/field-group-dto";
import { FieldValueDTO } from "../models/field-value-dto";
import { Field } from "../models/report-loss-dto/field";
import { EntityMetaDataDto, MetaDataDto } from "../models/report-loss-dto/meta-data-dto";
import { Section } from "../models/report-loss-dto/section";
import { CompanyDetails } from "../models/company-dto";

@Injectable({
    providedIn: 'root'
})

export class EntityManagementService {

    private baseUrl = environment.API_BASE_URL + "/api/entitymanagement";
    private static INSURANCE_COMPANY__GROUP_NAME = 'Company Details';
    private static GARAGE_COMPANY_GROUP_NAME = "Garage Details";
    private ClickAddnew = new BehaviorSubject<boolean>(false);
    public ClickAdd$ = this.ClickAddnew.asObservable();
    @Output() cardShow = new EventEmitter<boolean>();
    @Output() listpage = new EventEmitter<boolean>();

    // sectionId:string;
    // sectionName:string;
    // fieldList:EntityField[];
    // isAllFilled: boolean;
    constructor(private request: HttpClient) { }

    getFieldInfo() {
        const insuranceField = [{
            fieldId: '1',
            fieldName: "companyName",
            fieldType: "String",
            aliasName: "Name of the Company",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "companyName",
            value: null,
            readOnly: true
        },
        {
            fieldId: '2',
            fieldName: "emailId",
            fieldType: "String",
            aliasName: "Email Address",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "emailId",
            value: null,
            readOnly: true
        },
        {
            fieldId: '3',
            fieldName: "phoneNumber",
            fieldType: "Long",
            aliasName: "Phone Number",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "phoneNumber",
            value: null,
            readOnly: true

        },
        {
            fieldId: '4',
            fieldName: "location",
            fieldType: "String",
            aliasName: "Location",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "location",
            value: null,
            readOnly: true
        },
        {
            fieldId: '5',
            fieldName: "address",
            fieldType: "text",
            aliasName: "Address",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "address",
            value: null,
            readOnly: true
        },
        {
            fieldId: '6',
            fieldName: "companyUserId",
            fieldType: "String",
            aliasName: "Company User Id",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "companyUserId",
            value: null,
            readOnly: true
        },
        {
            fieldId: '7',
            fieldName: "Password",
            fieldType: "String",
            aliasName: "Password",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "password",
            value: null,
            readOnly: true
        },
        {
            fieldId: '8',
            fieldName: "logo",
            fieldType: "file",
            aliasName: "Logo",
            mandatory: true,
            isCoreData: true,
            defaultValues: null,
            entityName: "NewCompanies",
            columnName: "logo",
            value: null,
            readOnly: true
        },
        ]

        return of(insuranceField);
    }

    getThreshholdFieldInfo() {
        const ThreshholdField = [
            {
                fieldId: '9',
                fieldName: "maximumPayableAmount",
                fieldType: "String",
                aliasName: "Maximum Payable Amount",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "maximumPayableAmount",
                value: null,
                readOnly: true
            },
            {
                fieldId: '10',
                fieldName: "maximumTime",
                fieldType: "String",
                aliasName: "Maximum Time",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "maximumTime",
                value: null,
                readOnly: true
            }
        ]

        return of(ThreshholdField);
    }

    getInsuranceCompanySectionInfo() {
        const insuranceSectionField = [{
            sectionId: "1",
            sectionName: "InsuranceSection",
            subSection: [
                {
                    sectionId: "1",
                    sectionName: "InsuranceSection",
                    fieldList: [
                        {
                            fieldId: '1',
                            fieldName: "maximumPayableAmount",
                            fieldType: "String",
                            aliasName: "Maximum Payable Amount",
                            mandatory: true,
                            isCoreData: true,
                            defaultValues: null,
                            entityName: "NewCompanies",
                            columnName: "maximumPayableAmount",
                            value: null,
                            readOnly: true
                        },
                        {
                            fieldId: '2',
                            fieldName: "maximumTime",
                            fieldType: "String",
                            aliasName: "Maximum Time",
                            mandatory: true,
                            isCoreData: true,
                            defaultValues: null,
                            entityName: "NewCompanies",
                            columnName: "maximumTime",
                            value: null,
                            readOnly: true
                        }
                    ],
                    isAllFilled: false
                }
            ],
            fieldList: [{
                fieldId: '1',
                fieldName: "companyName",
                fieldType: "String",
                aliasName: "Name of the Company",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "companyName",
                value: null,
                readOnly: true
            },
            {
                fieldId: '2',
                fieldName: "emailId",
                fieldType: "String",
                aliasName: "Email Address",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "emailId",
                value: null,
                readOnly: true
            },
            {
                fieldId: '3',
                fieldName: "phoneNumber",
                fieldType: "Long",
                aliasName: "Phone Number",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "phoneNumber",
                value: null,
                readOnly: true

            },
            {
                fieldId: '4',
                fieldName: "location",
                fieldType: "String",
                aliasName: "Location",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "location",
                value: null,
                readOnly: true
            },
            {
                fieldId: '5',
                fieldName: "address",
                fieldType: "text",
                aliasName: "Address",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "address",
                value: null,
                readOnly: true
            },
            {
                fieldId: '6',
                fieldName: "companyUserId",
                fieldType: "String",
                aliasName: "Company User Id",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "companyUserId",
                value: null,
                readOnly: true
            },
            {
                fieldId: '7',
                fieldName: "Password",
                fieldType: "String",
                aliasName: "Password",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "password",
                value: null,
                readOnly: true
            },
            {
                fieldId: '8',
                fieldName: "logo",
                fieldType: "file",
                aliasName: "Logo",
                mandatory: true,
                isCoreData: true,
                defaultValues: null,
                entityName: "NewCompanies",
                columnName: "logo",
                value: null,
                readOnly: true
            },
            ],
            isAllFilled: false
        }]
        return of(insuranceSectionField);
    }

    // pageId:string;
    // pageName:string;
    // sectionList:EntitySection[];
    getInsuranceMetaDataInfo() {
        const insuranceMetaData = [
            {
                pageId: "sdffg",
                pageName: "EntityManagement",
                sectionList: [{
                    sectionId: "1",
                    sectionName: "InsuranceSection",
                    subSection: [
                        {
                            sectionId: "1",
                            sectionName: "ThreshholdSection",
                            fieldList: [
                                {
                                    fieldId: '1',
                                    fieldName: "maximumPayableAmount",
                                    fieldType: "String",
                                    aliasName: "Maximum Payable Amount",
                                    mandatory: true,
                                    isCoreData: true,
                                    defaultValues: null,
                                    entityName: "NewCompanies",
                                    columnName: "maximumPayableAmount",
                                    value: null,
                                    readOnly: true
                                },
                                {
                                    fieldId: '2',
                                    fieldName: "maximumTime",
                                    fieldType: "String",
                                    aliasName: "Maximum Time",
                                    mandatory: true,
                                    isCoreData: true,
                                    defaultValues: null,
                                    entityName: "NewCompanies",
                                    columnName: "maximumTime",
                                    value: null,
                                    readOnly: true
                                }
                            ],
                            isAllFilled: false
                        }
                    ],
                    fieldList: [{
                        fieldId: '1',
                        fieldName: "companyName",
                        fieldType: "String",
                        aliasName: "Name of the Company",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "companyName",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '2',
                        fieldName: "emailId",
                        fieldType: "String",
                        aliasName: "Email Address",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "emailId",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '3',
                        fieldName: "phoneNumber",
                        fieldType: "Long",
                        aliasName: "Phone Number",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "phoneNumber",
                        value: null,
                        readOnly: true

                    },
                    {
                        fieldId: '4',
                        fieldName: "location",
                        fieldType: "String",
                        aliasName: "Location",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "location",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '5',
                        fieldName: "address",
                        fieldType: "text",
                        aliasName: "Address",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "address",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '6',
                        fieldName: "companyUserId",
                        fieldType: "String",
                        aliasName: "Company User Id",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "companyUserId",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '7',
                        fieldName: "Password",
                        fieldType: "String",
                        aliasName: "Password",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "password",
                        value: null,
                        readOnly: true
                    },
                    {
                        fieldId: '8',
                        fieldName: "logo",
                        fieldType: "file",
                        aliasName: "Logo",
                        mandatory: true,
                        isCoreData: true,
                        defaultValues: null,
                        entityName: "NewCompanies",
                        columnName: "logo",
                        value: null,
                        readOnly: true
                    },
                    ],
                    isAllFilled: false
                }]
            }
        ]

        return of(insuranceMetaData);
    }

    getInsuranceOrGarageCompanyMetaData(pageId: string, companyId: string) {
        if (companyId === null || companyId === undefined) {
            return this.request.get<EntityMetaDataDto>(this.baseUrl + "/getpageinfo?page_id=" + pageId);
        }
        else {
            return this.request.get<EntityMetaDataDto>(this.baseUrl + "/getpageinfo?page_id=" + pageId + "&reference_id=" + companyId);
        }
    }

    public saveInsuranceCompany(insuranceCompany: MetaDataDto, companyId: string, pageId: string, isActive: boolean): Observable<any> {
        let fieldGroupDTO: FieldGroupDTO
        if (pageId === "29") {
            fieldGroupDTO = this.convertToFieldGroup(insuranceCompany);
        }
        else {
            fieldGroupDTO = this.convertToFieldGroupGarage(insuranceCompany);
        }
        if (companyId === null || companyId === undefined) {
            return this.request.post(this.baseUrl + '/saveOrUpdate?page_id=' + pageId + "&is_active=" + isActive, fieldGroupDTO);
        } else {
            return this.request.post(this.baseUrl + '/saveOrUpdate?page_id=' + pageId + "&reference_id=" + companyId + "&is_active=" + isActive, fieldGroupDTO);
        }
    }

    private convertToFieldGroup(insuranceCompany: MetaDataDto): FieldGroupDTO {
        const fieldGroupDTO: FieldGroupDTO = {
            groupName: EntityManagementService.INSURANCE_COMPANY__GROUP_NAME,
            fieldValues: [],
            fieldGroups: []
        };

        const metaData = insuranceCompany;
        const sectionList = metaData.sectionList;
        sectionList.forEach((section: Section) => {
            this.getFieldGroupDTO(section, fieldGroupDTO);
        });
        return fieldGroupDTO;
    }


    private convertToFieldGroupGarage(insuranceCompany: MetaDataDto): FieldGroupDTO {
        const fieldGroupDTO: FieldGroupDTO = {
            groupName: EntityManagementService.GARAGE_COMPANY_GROUP_NAME,
            fieldValues: [],
            fieldGroups: []
        };

        const metaData = insuranceCompany;
        const sectionList = metaData.sectionList;
        sectionList.forEach((section: Section) => {
            this.getFieldGroupDTO(section, fieldGroupDTO);
        });
        return fieldGroupDTO;
    }

    private getFieldGroupDTO(section: Section, parentFieldGroup: FieldGroupDTO): FieldGroupDTO {
        if (section !== undefined && section !== null) {
            const fieldGroup: FieldGroupDTO = {
                groupName: section.sectionName,
                fieldValues: [],
                fieldGroups: []
            };
            if (section.fieldList && section.fieldList.length > 0) {
                section.fieldList.forEach((field: Field) => {
                    const fieldDTO: FieldDTO = {
                        fieldId: field.fieldId,
                        aliasName:field.aliasName,
                        fieldName: field.fieldName,
                        fieldType: field.fieldType,
                        fieldDefault: field.defaultValues,
                        minlength: field.minLength,
                        maxlength: field.maxLength,
                        regex:field.regex,
                        mandatory:field.mandatory
                    };
                    const fieldValueDTO: FieldValueDTO = {
                        field: fieldDTO,
                        value: field.value
                    };
                    fieldGroup.fieldValues.push(fieldValueDTO);
                });
            }
            if (section.sectionList && section.sectionList.length > 0) {
                section.sectionList.forEach((subSection: Section) => {
                    this.getFieldGroupDTO(subSection, fieldGroup);
                });
            }
            parentFieldGroup.fieldGroups.push(fieldGroup);
        }
        return parentFieldGroup;
    }

    public getInsuranceList(min: number, max: number) {
        return this.request.get<CompanyDetails[]>(this.baseUrl + "/getInsuranceData" + '?min=' + min + '&max=' + max);
    }

    public excelDownload(PurchaseStockList: any) {
        return this.request.post(environment.API_BASE_URL + "/digital-paper/excel-download", PurchaseStockList, { responseType: 'blob' });
    }

    public getInsuranceCount() {
        return this.request.get<InsuranceCompanyDto[]>(this.baseUrl + "/getInsuranceDataCount");
    }

    public getGarageList(min: number, max: number) {
        return this.request.get<GarageDto[]>(this.baseUrl + "/getGarageData" + '?min=' + min + '&max=' + max);
    }

    public getGarageListCount() {
        return this.request.get<GarageDto[]>(this.baseUrl + "/getGarageCount");
    }

    public showCard(value) {
        this.cardShow.emit(value);
    }
    public DeleteCompany(Id: any) {
        return this.request.get<any>(this.baseUrl + "/DeleteCompanyIdentiy" + '?companyId=' + Id);

    }

    public DeleteGarage(Id: any) {
        return this.request.get<any>(this.baseUrl + "/DeleteGarageIdentiy" + '?garageId=' + Id);
    }

    public saveFile(companyId: string, fileUrl: string, pageId: string): Observable<any> {
        return this.request.post(this.baseUrl + "/updateFileUrl?page_id=" + pageId + "&file_url=" + fileUrl + "&reference_id=" + companyId, {});
    }

    getAddNew(): Observable<boolean> {
        return this.ClickAddnew;

    }
    setAddNew(value: boolean) {
        return this.ClickAddnew.next(value);

    }

    public listShow(data: boolean) {
        this.listpage.emit(data)

    }
}

