import { IsNotEmpty, IsString } from 'class-validator';

export class AddMistakeDto {
  @IsString()
  @IsNotEmpty({ message: 'Mistake description is required' })
  text!: string;
}
