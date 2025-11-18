using AutoMapper;
using BookStoreApi.Models;
using BookStoreApi.Dtos;

namespace BookStoreApi.Mapping;
public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Book, BookDto>().ReverseMap();
        CreateMap<BookCreateDto, Book>();
        CreateMap<BookUpdateDto, Book>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Author, AuthorDto>().ReverseMap();
        CreateMap<AuthorCreateDto, Author>();
        CreateMap<AuthorUpdateDto, Author>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Order, OrderDto>().ReverseMap();
        CreateMap<OrderCreateDto, Order>();
        CreateMap<OrderUpdateDto, Order>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
