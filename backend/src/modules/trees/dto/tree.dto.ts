
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTreeDto {
    @IsString()
    @IsOptional()
    @Transform(({ value, obj }) => obj?.title ?? obj?.name ?? value)
    title?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value, obj }) => obj?.name ?? obj?.title ?? value)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    archiveSource?: string;

    @IsString()
    @IsOptional()
    documentCode?: string;

    @IsOptional()
    isPublic?: boolean | string;

    @IsString()
    @IsOptional()
    dataFormat?: string;

    @IsString()
    @IsOptional()
    data_format?: string;

    @IsString()
    @IsOptional()
    gedcomText?: string;

    @IsString()
    @IsOptional()
    gedcom_text?: string;

    @IsOptional()
    idempotencyKey?: string;

    @IsOptional()
    idempotency_key?: string;
}

export class UpdateTreeDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    archiveSource?: string;

    @IsString()
    @IsOptional()
    documentCode?: string;

    @IsOptional()
    isPublic?: boolean | string;

    @IsString()
    @IsOptional()
    dataFormat?: string;

    @IsString()
    @IsOptional()
    data_format?: string;

    @IsString()
    @IsOptional()
    gedcomText?: string;

    @IsString()
    @IsOptional()
    gedcom_text?: string;

    @IsOptional()
    idempotencyKey?: string;

    @IsOptional()
    idempotency_key?: string;
}

