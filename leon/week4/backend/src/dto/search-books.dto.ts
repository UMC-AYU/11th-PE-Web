import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchBooksDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    keyword?: string;
}
