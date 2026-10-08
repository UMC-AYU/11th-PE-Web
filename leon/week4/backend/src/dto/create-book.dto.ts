import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
    @IsInt()
    @Min(1)
    categoryId: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string;
}
