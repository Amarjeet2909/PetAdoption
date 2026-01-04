using FluentValidation;
using PetAdoption.API.Contracts.Pets;

namespace PetAdoption.API.Validators.Pets
{
    public class CreatePetRequestValidator : AbstractValidator<CreatePetRequest>
    {
        public CreatePetRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);

            RuleFor(x => x.AgeInMonths).GreaterThanOrEqualTo(0);

            RuleFor(x => x.Latitude).InclusiveBetween(-90, 90);

            RuleFor(x => x.Longitude).InclusiveBetween(-180, 180);

            RuleFor(x => x.OwnerId).NotEmpty();

            RuleFor(x => x.Description).MaximumLength(500);
        }
    }
}